import json
import logging
import re

import httpx
from pydantic import BaseModel

from app.core.config import settings

logger = logging.getLogger(__name__)


class GenerateCaptionRequest(BaseModel):
    prompt: str
    clubId: str
    clubName: str | None = None


class AiService:
    @staticmethod
    def _fallback_caption(prompt: str, club_name: str | None = None):
        clean_prompt = prompt.strip()
        prefix = f"{club_name} presente" if club_name else "Votre club presente"
        suffix = "..." if len(clean_prompt) > 90 else ""
        return {
            "caption": (
                f"{prefix} : {clean_prompt[:90]}{suffix}. "
                "Rejoignez-nous pour vivre ce moment avec la communaute ISET."
            ),
            "hashtags": ["#ClubHub", "#ISET", "#VieEtudiante", "#Evenement", "#Tunisie"],
        }

    @staticmethod
    def _caption_prompt(prompt: str, club_name: str | None = None):
        club = club_name or "ISET ClubHub"
        return (
            f"Club: {club}\n"
            f"Description: {prompt.strip()}\n\n"
            "Retourne uniquement un objet JSON valide avec cette forme exacte:\n"
            '{"caption":"caption courte en francais","hashtags":["#tag1","#tag2"]}'
        )

    @staticmethod
    def _parse_caption_response(content: str):
        cleaned = content.strip()
        if cleaned.startswith("```"):
            cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
            cleaned = re.sub(r"\s*```$", "", cleaned)

        try:
            parsed = json.loads(cleaned)
            caption = str(parsed.get("caption", "")).strip()
            hashtags = parsed.get("hashtags", [])
            if caption and isinstance(hashtags, list):
                return {
                    "caption": caption,
                    "hashtags": [
                        tag if str(tag).startswith("#") else f"#{tag}"
                        for tag in [str(item).strip() for item in hashtags if str(item).strip()]
                    ][:8],
                }
        except json.JSONDecodeError:
            pass

        hashtags = re.findall(r"#[\w\u00C0-\u017F-]+", content)
        caption = re.sub(r"#[\w\u00C0-\u017F-]+", "", content).strip()
        return {
            "caption": caption,
            "hashtags": hashtags[:8] or ["#ClubHub", "#ISET"],
        }

    @staticmethod
    def _extract_gemini_text(response_data: dict) -> str:
        candidates = response_data.get("candidates") or []
        if not candidates:
            raise RuntimeError("Gemini n'a retourne aucune suggestion.")

        parts = candidates[0].get("content", {}).get("parts", [])
        text_parts = [part.get("text", "") for part in parts if part.get("text")]
        if not text_parts:
            raise RuntimeError("Gemini a retourne une reponse vide.")

        return "\n".join(text_parts)

    @staticmethod
    async def _generate_with_gemini(prompt: str, club_name: str | None = None):
        if not settings.GEMINI_API_KEY:
            logger.warning("[AI MOCK] GEMINI_API_KEY non configuree. Utilisation du fallback local.")
            return AiService._fallback_caption(prompt, club_name)

        url = (
            "https://generativelanguage.googleapis.com/v1beta/models/"
            f"{settings.GEMINI_MODEL}:generateContent"
        )
        payload = {
            "system_instruction": {
                "parts": [
                    {
                        "text": (
                            "Tu es un assistant de communication pour les clubs universitaires de l'ISET. "
                            "Genere des captions courtes, claires et motivantes en francais, avec 4 a 7 hashtags."
                        )
                    }
                ]
            },
            "contents": [
                {
                    "parts": [
                        {
                            "text": AiService._caption_prompt(prompt, club_name)
                        }
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.7,
                "maxOutputTokens": 220,
            },
        }

        try:
            async with httpx.AsyncClient(timeout=30) as client:
                response = await client.post(
                    url,
                    headers={
                        "Content-Type": "application/json",
                        "x-goog-api-key": settings.GEMINI_API_KEY,
                    },
                    json=payload,
                )

            if response.status_code == 400:
                logger.error(f"Erreur Gemini 400 : {response.text}")
                raise RuntimeError("Requete Gemini invalide. Verifiez le modele GEMINI_MODEL.")
            if response.status_code in {401, 403}:
                logger.error(f"Authentification Gemini refusee : {response.text}")
                raise RuntimeError("Gemini refuse la cle API. Verifiez GEMINI_API_KEY dans backend-python/.env.")
            if response.status_code == 429:
                logger.error(f"Quota Gemini atteint : {response.text}")
                raise RuntimeError("Limite Gemini atteinte. Reessayez plus tard ou changez de modele Gemini.")
            if response.status_code >= 500:
                logger.error(f"Erreur serveur Gemini : {response.text}")
                raise RuntimeError("Gemini a retourne une erreur temporaire. Reessayez dans quelques instants.")

            response.raise_for_status()
            content = AiService._extract_gemini_text(response.json())
            return AiService._parse_caption_response(content)
        except httpx.RequestError as exc:
            logger.error(f"Connexion Gemini impossible : {exc}")
            raise RuntimeError("Connexion a Gemini impossible. Verifiez votre reseau puis reessayez.")

    @staticmethod
    async def generate_caption(prompt: str, club_name: str | None = None):
        return await AiService._generate_with_gemini(prompt, club_name)

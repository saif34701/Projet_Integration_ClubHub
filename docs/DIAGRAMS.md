# ISET ClubHub - Diagrammes UML

Ces diagrammes representent uniquement les fonctionnalites implementees dans le projet actuel. Les methodes affichees sont des methodes metier importantes, pas des getters/setters.

## Diagramme de classes general

Ce diagramme donne une vue metier simple du projet. Il ne copie pas les noms exacts du code; il montre les objets importants de l'application et les actions principales que chaque objet permet de faire.

```mermaid
classDiagram
    class Utilisateur {
      +nom
      +email
      +role
      +statut
      +creerCompte()
      +seConnecter()
      +consulterDashboard()
    }

    class Etudiant {
      +demanderAdhesion()
      +suivreDemandes()
      +consulterNotifications()
    }

    class ResponsableClub {
      +gererDemandes()
      +publierAnnonce()
      +creerEvenement()
      +planifierReunion()
      +gererMembres()
    }

    class Administrateur {
      +gererClubs()
      +gererUtilisateurs()
      +consulterStatistiques()
    }

    class Club {
      +nom
      +description
      +categorie
      +statut
      +activerClub()
      +modifierInformations()
      +desactiverClub()
    }

    class Adhesion {
      +roleDansClub
      +statut
      +dateAdhesion
      +ajouterMembre()
      +retirerMembre()
    }

    class DemandeAdhesion {
      +message
      +statut
      +dateDemande
      +accepter()
      +refuser()
    }

    class Annonce {
      +titre
      +contenu
      +visibilite
      +datePublication
      +publier()
      +modifier()
      +supprimer()
    }

    class Evenement {
      +titre
      +description
      +lieu
      +dateDebut
      +dateFin
      +estEnLigne
      +creer()
      +modifier()
      +annuler()
    }

    class Reunion {
      +titre
      +description
      +plateforme
      +lien
      +dateDebut
      +dateFin
      +planifier()
      +modifier()
      +annuler()
    }

    class Notification {
      +titre
      +message
      +type
      +statutLecture
      +envoyer()
      +marquerCommeLue()
    }

    class AssistantIA {
      +idee
      +caption
      +hashtags
      +genererCaption()
      +proposerHashtags()
    }

    class Dashboard {
      +nombreClubs
      +nombreUtilisateurs
      +nombreDemandes
      +nombreNotifications
      +calculerStatistiques()
    }

    Utilisateur <|-- Etudiant
    Utilisateur <|-- ResponsableClub
    Utilisateur <|-- Administrateur

    ResponsableClub "1" --> "0..*" Club : gere
    Club "1" --> "0..*" Adhesion : contient
    Etudiant "1" --> "0..*" Adhesion : devient membre via
    Etudiant "1" --> "0..*" DemandeAdhesion : envoie
    Club "1" --> "0..*" DemandeAdhesion : recoit

    Club "1" --> "0..*" Annonce : publie
    Club "1" --> "0..*" Evenement : organise
    Club "1" --> "0..*" Reunion : planifie

    Utilisateur "1" --> "0..*" Notification : recoit
    DemandeAdhesion --> Notification : declenche
    Annonce --> Notification : informe les membres

    ResponsableClub --> AssistantIA : utilise
    AssistantIA --> Annonce : aide a rediger

    Utilisateur --> Dashboard : consulte
    Administrateur --> Dashboard : analyse
    ResponsableClub --> Dashboard : suit son activite
    Etudiant --> Dashboard : suit son espace
```

## Cas d'utilisation general

```mermaid
flowchart LR
    Visitor[Visiteur]
    Student[Etudiant]
    Manager[Responsable de club]
    Admin[Administrateur]

    UC1((Consulter clubs))
    UC2((Consulter annonces et evenements))
    UC3((Creer un compte))
    UC4((Se connecter))
    UC5((Demander adhesion))
    UC6((Consulter notifications))
    UC7((Gerer demandes d'adhesion))
    UC8((Publier annonces))
    UC9((Creer evenements))
    UC10((Creer reunions))
    UC11((Generer caption avec IA))
    UC12((Gerer clubs))
    UC13((Gerer utilisateurs))
    UC14((Consulter dashboards))

    Visitor --> UC1
    Visitor --> UC2
    Visitor --> UC3
    Visitor --> UC4

    Student --> UC4
    Student --> UC5
    Student --> UC6
    Student --> UC14

    Manager --> UC4
    Manager --> UC7
    Manager --> UC8
    Manager --> UC9
    Manager --> UC10
    Manager --> UC11
    Manager --> UC14

    Admin --> UC4
    Admin --> UC12
    Admin --> UC13
    Admin --> UC14
```

## Sequence: authentification

Modele utilise: actor / interface frontend / system backend / external systems.

```mermaid
sequenceDiagram
    actor Actor as Utilisateur
    participant Interface as Interface React
    participant System as System Backend FastAPI
    participant DB as Ext System MongoDB
    participant JWT as Ext System JWT

    Actor->>Interface: Saisit email et mot de passe
    Interface->>System: POST /api/auth/login
    System->>DB: Chercher utilisateur par email
    DB-->>System: Donnees utilisateur avec passwordHash
    System->>System: verify_password()
    System->>JWT: create_access_token(userId, role)
    JWT-->>System: Token signe
    System-->>Interface: user + token
    Interface-->>Actor: Acces au dashboard selon le role
```

## Sequence: demande d'adhesion et decision responsable

```mermaid
sequenceDiagram
    actor Student as Etudiant
    actor Manager as Responsable
    participant Interface as Interface React
    participant System as System Backend FastAPI
    participant DB as Ext System MongoDB
    participant Notif as Ext System Notifications internes

    Student->>Interface: Demande adhesion a un club
    Interface->>System: POST /api/membership/request
    System->>DB: Verifier club actif
    System->>DB: Verifier absence membership actif
    System->>DB: Verifier absence demande pending
    System->>DB: Creer JoinRequest PENDING
    System-->>Interface: Demande enregistree
    Interface-->>Student: Statut pending

    Manager->>Interface: Accepte ou refuse la demande
    Interface->>System: PATCH /api/membership/{id}/accept ou reject
    System->>DB: Charger JoinRequest
    System->>DB: Mettre a jour status + reviewer
    alt Demande acceptee
        System->>DB: Creer Membership ACTIVE
        System->>Notif: Notification SUCCESS
    else Demande refusee
        System->>Notif: Notification INFO
    end
    Notif->>DB: Enregistrer notification
    System-->>Interface: Demande traitee
    Interface-->>Manager: Liste des demandes mise a jour
```

## Sequence: publication d'une annonce avec IA

```mermaid
sequenceDiagram
    actor Manager as Responsable
    participant Interface as Interface React
    participant System as System Backend FastAPI
    participant Gemini as Ext System Gemini API
    participant DB as Ext System MongoDB
    participant Notif as Ext System Notifications internes

    Manager->>Interface: Saisit une idee d'annonce
    Interface->>System: POST /api/ai/generate-caption
    System->>Gemini: generateContent(prompt)
    alt Gemini disponible
        Gemini-->>System: Texte genere
        System->>System: _parse_caption_response()
    else Cle API absente ou erreur
        System->>System: _fallback_caption()
    end
    System-->>Interface: Caption + hashtags

    Manager->>Interface: Valide et publie l'annonce
    Interface->>System: POST /api/announcements/
    System->>DB: Enregistrer Announcement
    System->>DB: Charger membres actifs du club
    loop Pour chaque membre
        System->>Notif: create(userId, title, message, INFO)
        Notif->>DB: Enregistrer Notification
    end
    System-->>Interface: Annonce publiee
    Interface-->>Manager: Confirmation
```

import httpx

BASE_URL = "http://localhost:8000/api"

def test_endpoint(name, method, url, **kwargs):
    try:
        response = httpx.request(method, f"{BASE_URL}{url}", **kwargs)
        if response.status_code < 400:
            print(f"OK   - {name} [{response.status_code}]")
            return response.json() if response.content else None
        else:
            print(f"FAIL - {name} [{response.status_code}]: {response.text}")
    except Exception as e:
        print(f"FAIL - {name} [Exception]: {e}")
    return None

def run_tests():
    print("--- Début des tests API FastAPI ---")
    
    # Health
    test_endpoint("Health Check", "GET", "/health")
    
    # Auth
    # Remplacez avec un compte valide de la DB seedée
    login_data = {"email": "admin@clubhub.tn", "password": "Admin123!"}
    login_res = test_endpoint("Login Admin", "POST", "/auth/login", json=login_data)
    
    token = None
    if login_res and "token" in login_res:
        token = login_res["token"]
    
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    
    test_endpoint("Get Me", "GET", "/auth/me", headers=headers)
    
    # Clubs
    test_endpoint("Get All Clubs", "GET", "/clubs/")
    
    # IA Fallback
    test_endpoint("Generate AI Caption", "POST", "/ai/generate-caption", headers=headers, json={"prompt": "Test événement", "clubId": "test"})
    
    print("--- Fin des tests ---")

if __name__ == "__main__":
    run_tests()

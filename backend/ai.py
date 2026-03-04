from google import genai
# The client gets the API key from the environment variable `GEMINI_API_KEY`.

code = ... 

client = genai.Client()

response = client.models.generate_content(
    model="gemini-2.5-flash", contents="" + code
)
print(response.text)
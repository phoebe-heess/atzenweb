import requests
import json
import sys # Import sys to access command-line arguments

# Configuration for your local Ollama instance
OLLAMA_API_BASE = "http://localhost:11434"
MODEL_NAME = "gemma4:12b-it-qat" # The model you've pulled via Ollama

def generate_code_with_gemma(prompt: str, temperature: float = 0.7) -> str:
    """
    Sends a prompt to the local Gemma 4 12B QAT model via Ollama and returns the generated code.
    """
    url = f"{OLLAMA_API_BASE}/api/generate"
    headers = {"Content-Type": "application/json"}
    data = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": False, # Set to True if you want to process the response as a stream
        "options": {
            "temperature": temperature,
            # You can add other Ollama-specific options here, e.g., "num_ctx": 4096
        }
    }

    try:
        response = requests.post(url, headers=headers, data=json.dumps(data))
        response.raise_for_status() # Raise an exception for HTTP errors
        result = response.json()
        return result["response"]
    except requests.exceptions.ConnectionError:
        print(f"Error: Could not connect to Ollama at {OLLAMA_API_BASE}. Is Ollama running?")
        return ""
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return ""

def simple_coding_agent(task_description: str) -> None:
    """
    A simple agent that uses Gemma 4 12B QAT to generate code for a given task.
    """
    # The print statements for "Agent received task" and "--- Generated Code ---"
    # are removed here as Continue will display the raw output of the shell command.
    
    coding_prompt = f"""You are an expert Python programmer.
Your task is to write a Python function that accomplishes the following:
{task_description}

Provide only the Python code, without any additional explanations or markdown formatting.
"""

    generated_code = generate_code_with_gemma(coding_prompt)

    if generated_code:
        print(generated_code.strip()) # Print the generated code directly to stdout
    else:
        print("Code generation failed.")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        # Join all arguments after the script name to form the task description
        task_description = " ".join(sys.argv[1:])
        simple_coding_agent(task_description)
    else:
        print("Usage: python my_coding_agent.py \"Your coding task description\"")
        # Optionally, you could run a default task if no argument is provided,
        # but for integration with Continue, expecting an argument is better.

import time

from decouple import config
import openai


def _ask_gpt(
    prompts: list,
    system_role: str = "You are a very smart bot, specialized at playing the '20 questions' game.",
    temperature: float = 0.5,
    version: str = "gpt-3.5-turbo",
    stream: bool = False,
) -> dict:
    openai.api_key = config("OPENAI_API_KEY")
    messages = [{"role": "system", "content": system_role}]
    for prompt in prompts:
        messages.append({"role": "user", "content": prompt})

    try:
        res = openai.ChatCompletion.create(
            model=version,
            messages=messages,
            top_p=1,
            temperature=temperature,
            stream=stream,
        )

        if stream:
            return res

        return {
            "status": "success",
            "result": res.choices[0].message["content"].strip(),
        }

    except openai.error.Timeout as e:
        # Handle timeout error, e.g. retry or log
        # print(f"OpenAI API request timed out: {e}")
        return {
            "status": "failed",
            "message": f"OpenAI API request timed out: {e}",
            "result": "",
        }

    except openai.error.APIError as e:
        # Handle API error, e.g. retry or log
        # print(f"OpenAI API returned an API Error: {e}")
        return {
            "status": "failed",
            "message": f"OpenAI API returned an API Error: {e}",
            "result": "",
        }
    except openai.error.APIConnectionError as e:
        # Handle connection error, e.g. check network or log
        # print(f"OpenAI API request failed to connect: {e}")
        return {
            "status": "failed",
            "message": f"OpenAI API request failed to connect: {e}",
            "result": "",
        }
    except openai.error.InvalidRequestError as e:
        # Handle invalid request error, e.g. validate parameters or log
        # print(f"OpenAI API request was invalid: {e}")
        return {
            "status": "failed",
            "message": f"OpenAI API request was invalid: {e}",
            "result": "",
        }
    except openai.error.AuthenticationError as e:
        # Handle authentication error, e.g. check credentials or log
        # print(f"OpenAI API request was not authorized: {e}")
        return {
            "status": "failed",
            "message": f"OpenAI API request was not authorized: {e}",
            "result": "",
        }
    except openai.error.PermissionError as e:
        # Handle permission error, e.g. check scope or log
        # print(f"OpenAI API request was not permitted: {e}")
        return {
            "status": "failed",
            "message": f"OpenAI API request was not permitted: {e}",
            "result": "",
        }
    except openai.error.RateLimitError as e:
        # Handle rate limit error, e.g. wait or log
        # print(f"OpenAI API request exceeded rate limit: {e}")
        return {
            "status": "failed",
            "message": f"OpenAI API request exceeded rate limit: {e}",
            "result": "",
        }


def ask_gpt(
    prompts: list,
    system_role: str = "You are a very smart bot, specialized at playing the '20 questions' game.",
    temperature: float = 0.3,
    version: str = "gpt-3.5-turbo",
    stream: bool = False,
) -> dict:
    response = None
    for i in range(5):
        time.sleep(1)
        response = _ask_gpt(prompts, system_role, temperature, version, stream)
        if response["status"] == "success":
            return response
    return response

import streamlit as st
from openai_client import ask_gpt
import time
import base64

if not hasattr(st.session_state, "question_history"):
    st.session_state.question_history = []

if not hasattr(st.session_state, "answer_history"):
    st.session_state.answer_history = []

st.title("Ask till you find the key!!")
st.write(
    'The bot will answer only "yes or no" questions!\nIf you ask a non yes-or-no question, there is no guarantee '
    "that the bot will respond correctly!"
)
st.write(
    "If you have a guess, just input the key itself (case insensitive), and the bot will let you know if it's "
    "correct."
)
key = "salt"

prompt = """
This is a secret KEY: "{key}".
You will be asked a QUESTION about this KEY.

Here is how you MUST respond to this QUESTION:
1. First, check if the QUESTION can be answered by a single "Yes" or "No".
    If yes: Answer the QUESTION by a single "Yes" or "No" correctly.

2. If the QUESTION cannot be answered by a yes-or-no, choose the most proper option among "Yes" and "No".

IMPORTANT: DO NOT output anything other than "Yes" or "No".
-----------------------------------------------------
Here is the QUESTION:
{question}
"""

# if not hasattr(st.session_state, 'remaining_tries'):
#     st.session_state.remaining_tries = 20
#
# if st.session_state.remaining_tries == 0:
#     # st.write("You're out of tries!")
#     st.session_state.remaining_tries = 20


question = st.text_input("Ask a yes-or-no question, or input the key!")
if question:
    time.sleep(3)
    if question.lower() == key.lower():
        st.write(
            f'Congrats! The key is "{key}". You found the key!\nThe flag is the md5 encryption of this Key!'
        )
    else:
        query = prompt.format(question=question, key=key)

        result = ask_gpt([query])["result"]
        st.write(result)

        # st.session_state.remaining_tries -= 1
        st.session_state.question_history.append(question)
        st.session_state.answer_history.append(result)

# st.write('remaining tries:', st.session_state.remaining_tries)


with st.container():
    st.info("Question history")
    for question, answer in zip(
        st.session_state.question_history, st.session_state.answer_history
    ):
        st.write(question, ": ", answer)

image_path = "khodnevis.png"
link_url = "khodnevisai.com"
khodnevis_word = f'<a href="http://khodnevisai.com/new_feature" target="_blank">Khodnevis!</a>'
description = f"""Powered By {khodnevis_word}<br>Generates Evidence-Based Articles with AI: Makes Your Writing Precise and 
Unforgettable!"""

st.write("\n\n")
file_ = open(image_path, "rb")
contents = file_.read()
data_url = base64.b64encode(contents).decode("utf-8")
file_.close()


html_code = f'''
<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 40vh; text-align: center;">
    <a href="http://{link_url}" target="_blank">
        <img src="data:image/gif;base64,{data_url}" style="max-width: 15%; align-self: center;">
    </a>
    <p style="font-size: 12px;">{description}</p>
</div>
'''


# Displaying the HTML code in Streamlit
st.markdown(html_code, unsafe_allow_html=True)

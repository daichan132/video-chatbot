from langchain import PromptTemplate, LLMChain
from langchain.llms import OpenAI

from langchain.chains.conversation.memory import ConversationBufferWindowMemory



def ask_question(question: str) -> str:
    llm = OpenAI(temperature=0)
    template = """Question: {question}

    Answer:"""

    prompt = PromptTemplate(template=template, input_variables=["question"])
    llm_chain = LLMChain(prompt=prompt, llm=llm)

    answer = llm_chain.run(question)
    return answer


def create_conversational_chain():
    llm = OpenAI(temperature=0)
    template = """あなたは役に立つAIアシスタントです。最後の質問に答えてください。
答えがわからない場合は、「わからない」と答えてください。答えをでっち上げないでください。

{chat_history}

質問：{input}
マークダウン形式での役に立つ回答："""
    prompt = PromptTemplate(
        input_variables=["chat_history", "input"], template=template
    )
    memory = ConversationBufferWindowMemory(k=5, memory_key="chat_history")
    chain = LLMChain(
        llm=llm,
        prompt=prompt,
        verbose=True,
        memory=memory,
    )

    return chain
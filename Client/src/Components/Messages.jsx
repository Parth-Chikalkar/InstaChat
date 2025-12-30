function Messages({ messages = [], id }) {
  return (
    <div className="flex flex-col gap-2">
      {messages.map((msg) => {
        const isMine = msg.senderId === id;

        return (
          <div
            key={msg._id}
            className={`flex ${isMine ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[60%] px-3 py-2 rounded-xl text-sm ${
                isMine
                  ? "bg-purple-600 text-white rounded-br-none"
                  : "bg-white/20 text-white rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Messages;

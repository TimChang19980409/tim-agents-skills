import { useState } from "react";

type PostComposerProps = {
  onSubmit: (message: string) => Promise<void>;
};

export function PostComposer({ onSubmit }: PostComposerProps) {
  const [message, setMessage] = useState("");

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit(message);
        setMessage("");
      }}
    >
      <textarea value={message} onChange={(event) => setMessage(event.target.value)} />
      <button type="submit">Post</button>
    </form>
  );
}

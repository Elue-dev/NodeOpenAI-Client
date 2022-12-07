import { useState } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";

interface argTypes {
  prompt: string;
  size: string;
}

export default function PrimaryScreen() {
  const [values, setValues] = useState<argTypes>({
    prompt: "",
    size: "",
  });
  const [image, setImage] = useState<string>("");
  const [error, setError] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const server_url = import.meta.env.VITE_REACT_APP_SERVER_URL;

  const generateImage = async (e: any) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

    const imageData = {
      prompt: values.prompt,
      size: values.size,
    };

    try {
      const { data } = await axios.post(
        `${server_url}/openai/generate-image`,
        imageData
      );

      setImage(data?.data);
      setLoading(false);
      setMessage("Your image is ready!!");
      setTimeout(() => setError(null), 10000);
    } catch (error: any) {
      setLoading(false);
      setError(error?.response.data.message);
      setTimeout(() => setError(null), 10000);
    }
  };

  if (loading) {
    return (
      <div className="loader">
        <h3>We are preparing your image...</h3>

        <ClipLoader
          color={"rgba(14, 16, 30, 0.937)"}
          loading={true}
          size={50}
        />
      </div>
    );
  }

  return (
    <div>
      <header>
        <div className="navbar">
          <div className="logo">
            <h2>OpenAI Image Generator</h2>
          </div>
          <div className="nav-links">
            <ul>
              <li>
                <a href="https://beta.openai.com/docs" target="_blank">
                  OpenAI API Docs
                </a>
              </li>
            </ul>
          </div>
        </div>
      </header>

      <main>
        {error && <p className="error">{error}</p>}
        {message && <p className="message">{message}</p>}
        <section className="showcase">
          <form onSubmit={generateImage}>
            <h1>Describe An Image</h1>
            <div className="form-control">
              <input
                type="text"
                name="prompt"
                value={values.prompt}
                onChange={handleInputChange}
                placeholder="Enter Text"
              />
            </div>
            <div className="form-control">
              <select
                name="size"
                value={values.size}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Select a size
                </option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </div>
            <button type="submit" className="btn">
              Generate
            </button>
          </form>
        </section>

        {image && (
          <section className="image">
            <div className="image-container">
              <h2 className="msg"></h2>
              <img src={image} alt={values.prompt} />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

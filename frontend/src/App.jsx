import { useState } from 'react';

const initialForm = {
  name: '',
  bio: '',
  image: ''
};

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submittedProfile, setSubmittedProfile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = 'Full name is required.';
    if (!form.bio.trim()) nextErrors.bio = 'Bio is required.';
    if (!form.image.trim()) nextErrors.image = 'Profile image URL is required.';

    return nextErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type') || '';
        let errorMessage = 'Something went wrong while generating the profile card.';

        if (contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData?.error || errorMessage;
        } else {
          const errorText = await response.text();
          if (errorText.trim()) {
            errorMessage = errorText;
          }
        }

        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('The API returned an empty or invalid JSON response.');
      }

      const data = await response.json();
      setSubmittedProfile(data);
      setSuccessMessage('✅ Profile generated successfully.');
    } catch (error) {
      setSuccessMessage('');
      setSubmittedProfile(null);
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        setErrorMessage('Unable to reach the Flask backend at http://127.0.0.1:5000/profile. Start it with python app.py.');
      } else {
        setErrorMessage(error.message || 'Unable to submit the profile.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">React + Flask</p>
          <h1>User Profile Card Generator</h1>
          <p className="intro">
            Create a polished profile card from a simple form and preview the result instantly.
          </p>
        </div>

        <div className="content-grid">
          <form className="form-card" onSubmit={handleSubmit} noValidate>
            <label>
              <span>Full Name</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && <small id="name-error">{errors.name}</small>}
            </label>

            <label>
              <span>Bio</span>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Product designer who loves building intuitive interfaces."
                rows="5"
                aria-invalid={Boolean(errors.bio)}
                aria-describedby={errors.bio ? 'bio-error' : undefined}
              />
              {errors.bio && <small id="bio-error">{errors.bio}</small>}
            </label>

            <label>
              <span>Profile Image URL</span>
              <input
                type="text"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://images.example.com/profile.jpg"
                aria-invalid={Boolean(errors.image)}
                aria-describedby={errors.image ? 'image-error' : undefined}
              />
              {errors.image && <small id="image-error">{errors.image}</small>}
            </label>

            <button type="submit" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Profile Card'}
            </button>

            {errorMessage && <p className="status-message error">{errorMessage}</p>}
            {successMessage && (
              <p className="status-message success">
                {successMessage}
              </p>
            )}
          </form>

          {submittedProfile && (
            <section className="profile-card" aria-live="polite">
              <div className="avatar-wrap">
                <img src={submittedProfile.image} alt={submittedProfile.name} />
              </div>
              <div className="profile-copy">
                <h2>{submittedProfile.name}</h2>
                <p>{submittedProfile.bio}</p>
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}

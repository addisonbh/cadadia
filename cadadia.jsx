import { useState } from "react";

const CATEGORIES = [
  { key: "Food", spanish: "comida", icon: "🍽️", prompt: "Food" },
  { key: "Vacation", spanish: "vacaciones", icon: "✈️", prompt: "Vacation" },
  { key: "Work", spanish: "trabajo", icon: "💼", prompt: "Work" },
  { key: "Shopping", spanish: "compras", icon: "🛍️", prompt: "Shopping" },
  { key: "Family", spanish: "familia", icon: "👨‍👩‍👧", prompt: "Family & Relationships" },
  { key: "Health", spanish: "salud", icon: "🏥", prompt: "Health & Body" },
  { key: "Weather", spanish: "clima", icon: "🌤️", prompt: "Weather & Nature" },
];

const LEVELS = [
  { code: "A1", desc: "principiante" },
  { code: "A2", desc: "elemental" },
  { code: "B1", desc: "intermedio" },
  { code: "B2", desc: "avanzado" },
  { code: "C1", desc: "experto" },
];

export default function Cadadia() {
  const [category, setCategory] = useState(null);
  const [level, setLevel] = useState(null);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [revealed, setRevealed] = useState({});

  const generate = async () => {
    if (!category || !level) return;
    setLoading(true);
    setContent(null);
    setError(null);
    setRevealed({});

    const cat = CATEGORIES.find(c => c.key === category);

    const prompt = `You are a Spanish language teacher. Generate a daily Spanish lesson for a ${level} (CEFR) learner focused on the topic: "${cat.prompt}".

Return ONLY a valid JSON object with this exact structure:
{
  "word": {
    "spanish": "the Spanish word",
    "english": "English translation",
    "pronunciation": "phonetic pronunciation guide",
    "partOfSpeech": "noun/verb/adjective/etc"
  },
  "phrase": {
    "spanish": "a useful everyday phrase",
    "english": "English translation",
    "context": "one sentence explaining when to use it"
  },
  "sentence": {
    "spanish": "a full sentence using the word",
    "english": "English translation"
  },
  "paragraph": {
    "spanish": "a short paragraph (3-4 sentences) using the word and phrase naturally",
    "english": "English translation"
  },
  "tip": "one quick cultural or grammar tip related to this word or phrase"
}

Make the content genuinely useful, natural-sounding, and appropriately complex for ${level} level. No markdown, no explanation, just the JSON.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === "text")?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setContent(parsed);
    } catch (e) {
      setError("algo salió mal. intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const toggleReveal = (key) => {
    setRevealed(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const selectedCat = CATEGORIES.find(c => c.key === category);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0a0e1a 0%, #1a0a14 50%, #0d1525 100%)",
      fontFamily: "'Georgia', serif",
      color: "#e8e4f0",
      padding: "0 0 60px 0"
    }}>
      {/* Header */}
      <div style={{
        textAlign: "center",
        padding: "48px 24px 32px",
        borderBottom: "1px solid rgba(255,255,255,0.07)"
      }}>
        <div style={{
          fontSize: 11,
          letterSpacing: "0.35em",
          color: "#6b9fd4",
          textTransform: "uppercase",
          marginBottom: 14
        }}>
          TU LECCIÓN DE HOY
        </div>
        <h1 style={{
          fontSize: "clamp(2.4rem, 6vw, 3.8rem)",
          fontWeight: 400,
          margin: 0,
          letterSpacing: "-0.03em",
          color: "#fff",
          fontStyle: "italic"
        }}>
          cadadia
        </h1>
        <p style={{
          color: "rgba(232,228,240,0.45)",
          marginTop: 12,
          fontSize: 14,
          fontStyle: "italic",
          letterSpacing: "0.02em"
        }}>
          una palabra. una frase. una oración. un párrafo.
        </p>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 20px" }}>

        {/* Category Picker */}
        <Section title="ELIGE UNA CATEGORÍA">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {CATEGORIES.map(c => (
              <button key={c.key} onClick={() => setCategory(c.key)} style={{
                padding: "10px 18px",
                borderRadius: 100,
                border: category === c.key
                  ? "1.5px solid #6b9fd4"
                  : "1.5px solid rgba(255,255,255,0.12)",
                background: category === c.key
                  ? "rgba(107,159,212,0.15)"
                  : "rgba(255,255,255,0.03)",
                color: category === c.key ? "#6b9fd4" : "rgba(232,228,240,0.6)",
                cursor: "pointer",
                fontSize: 14,
                fontFamily: "inherit",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontStyle: "italic"
              }}>
                <span>{c.icon}</span> {c.spanish}
              </button>
            ))}
          </div>
        </Section>

        {/* Level Picker */}
        <Section title="ELIGE TU NIVEL">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {LEVELS.map(l => (
              <button key={l.code} onClick={() => setLevel(l.code)} style={{
                padding: "10px 18px",
                borderRadius: 100,
                border: level === l.code
                  ? "1.5px solid #8b2a4a"
                  : "1.5px solid rgba(255,255,255,0.12)",
                background: level === l.code
                  ? "rgba(139,42,74,0.2)"
                  : "rgba(255,255,255,0.03)",
                color: level === l.code ? "#c4607e" : "rgba(232,228,240,0.6)",
                cursor: "pointer",
                fontSize: 14,
                fontFamily: "inherit",
                transition: "all 0.2s",
                fontStyle: "italic"
              }}>
                <strong style={{ fontStyle: "normal" }}>{l.code}</strong>{" "}
                <span style={{ opacity: 0.7, fontSize: 12 }}>{l.desc}</span>
              </button>
            ))}
          </div>
        </Section>

        {/* Generate Button */}
        <div style={{ textAlign: "center", margin: "36px 0" }}>
          <button
            onClick={generate}
            disabled={!category || !level || loading}
            style={{
              padding: "14px 44px",
              background: category && level && !loading
                ? "linear-gradient(135deg, #8b2a4a, #6b3a7a)"
                : "rgba(139,42,74,0.2)",
              color: category && level && !loading ? "#fff" : "rgba(232,228,240,0.3)",
              border: "none",
              borderRadius: 100,
              fontSize: 14,
              fontFamily: "inherit",
              fontWeight: 600,
              cursor: category && level && !loading ? "pointer" : "default",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              transition: "all 0.2s",
              minWidth: 220
            }}
          >
            {loading ? "generando..." : content ? "GENERATE LESSON ↻" : "GENERATE LESSON →"}
          </button>
          {(!category || !level) && (
            <p style={{ fontSize: 12, color: "rgba(232,228,240,0.3)", marginTop: 10, fontStyle: "italic" }}>
              elige una categoría y un nivel para continuar
            </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{ textAlign: "center", color: "#c4607e", fontSize: 14, marginBottom: 24, fontStyle: "italic" }}>
            {error}
          </div>
        )}

        {/* Content Cards */}
        {content && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Word of the Day */}
            <Card accent="#6b9fd4" label="palabra del día">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                <div>
                  <div style={{ fontSize: "clamp(2rem, 6vw, 3rem)", fontWeight: 400, color: "#fff", lineHeight: 1, fontStyle: "italic" }}>
                    {content.word.spanish}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(232,228,240,0.38)", marginTop: 5 }}>
                    {content.word.pronunciation} · {content.word.partOfSpeech}
                  </div>
                </div>
                <div style={{
                  background: "rgba(107,159,212,0.12)",
                  border: "1px solid rgba(107,159,212,0.25)",
                  borderRadius: 8,
                  padding: "8px 14px",
                  fontSize: 14,
                  color: "#6b9fd4"
                }}>
                  {content.word.english}
                </div>
              </div>
            </Card>

            {/* Phrase */}
            <Card accent="#c4607e" label="frase del día">
              <div style={{ fontSize: "1.2rem", color: "#fff", marginBottom: 10, lineHeight: 1.5, fontStyle: "italic" }}>
                {content.phrase.spanish}
              </div>
              <RevealButton revealed={revealed.phrase} onToggle={() => toggleReveal("phrase")} />
              {revealed.phrase && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 14, color: "#c4607e" }}>{content.phrase.english}</div>
                  <div style={{ fontSize: 12, color: "rgba(232,228,240,0.4)", marginTop: 6, fontStyle: "italic" }}>
                    💡 {content.phrase.context}
                  </div>
                </div>
              )}
            </Card>

            {/* Sentence */}
            <Card accent="#4a7ab5" label="oración de ejemplo">
              <div style={{ fontSize: "1.1rem", color: "#fff", lineHeight: 1.7, marginBottom: 10, fontStyle: "italic" }}>
                {content.sentence.spanish}
              </div>
              <RevealButton revealed={revealed.sentence} onToggle={() => toggleReveal("sentence")} />
              {revealed.sentence && (
                <div style={{ marginTop: 10, fontSize: 14, color: "#6b9fd4", lineHeight: 1.6 }}>
                  {content.sentence.english}
                </div>
              )}
            </Card>

            {/* Paragraph */}
            <Card accent="#7a3a5a" label="párrafo completo">
              <div style={{ fontSize: "1rem", color: "#fff", lineHeight: 1.85, marginBottom: 10, fontStyle: "italic" }}>
                {content.paragraph.spanish}
              </div>
              <RevealButton revealed={revealed.paragraph} onToggle={() => toggleReveal("paragraph")} />
              {revealed.paragraph && (
                <div style={{ marginTop: 10, fontSize: 14, color: "#c4607e", lineHeight: 1.8 }}>
                  {content.paragraph.english}
                </div>
              )}
            </Card>

            {/* Tip */}
            {content.tip && (
              <div style={{
                background: "rgba(107,159,212,0.05)",
                border: "1px solid rgba(107,159,212,0.12)",
                borderRadius: 12,
                padding: "16px 20px",
                fontSize: 13,
                color: "rgba(232,228,240,0.55)",
                lineHeight: 1.8,
                display: "flex",
                gap: 10,
                alignItems: "flex-start"
              }}>
                <span style={{ fontSize: 16 }}>📌</span>
                <span>
                  <strong style={{ color: "rgba(232,228,240,0.8)" }}>consejo: </strong>
                  {content.tip}
                </span>
              </div>
            )}

            {/* Badge */}
            <div style={{ textAlign: "center", fontSize: 12, color: "rgba(232,228,240,0.25)", marginTop: 6, fontStyle: "italic" }}>
              {selectedCat?.icon} {selectedCat?.spanish} · cefr {level?.toLowerCase()}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginTop: 34 }}>
      <div style={{
        fontSize: 10,
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        color: "rgba(232,228,240,0.35)",
        marginBottom: 14
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Card({ label, accent, children }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderLeft: `3px solid ${accent}`,
      borderRadius: 12,
      padding: "20px 22px"
    }}>
      <div style={{
        fontSize: 10,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: accent,
        marginBottom: 12,
        opacity: 0.75
      }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function RevealButton({ revealed, onToggle }) {
  return (
    <button onClick={onToggle} style={{
      background: "none",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: 6,
      color: "rgba(232,228,240,0.4)",
      fontSize: 11,
      padding: "5px 12px",
      cursor: "pointer",
      fontFamily: "inherit",
      letterSpacing: "0.05em",
      fontStyle: "italic"
    }}>
      {revealed ? "ocultar traducción ↑" : "mostrar traducción ↓"}
    </button>
  );
}

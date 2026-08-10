import { useKeyBindings } from "keyboardist/react";
import { useEffect, useState } from "react";
import "@/styles/demo.css";

// Every letter in "keyboardist" is unique, so each keycap gets its own
// binding.
const LETTERS = [..."keyboardist"];

/**
 * The library name as a row of keycaps — each one presses down while its
 * key is held. keydown sets a letter held, keyup releases it.
 */
export function HeroKeys() {
  const [held, setHeld] = useState<Record<string, boolean>>({});

  const setLetter = (letter: string, down: boolean) =>
    setHeld((current) => ({ ...current, [letter]: down }));

  useKeyBindings(
    Object.fromEntries(
      LETTERS.map((letter) => [letter, () => setLetter(letter, true)]),
    ),
  );
  useKeyBindings(
    Object.fromEntries(
      LETTERS.map((letter) => [letter, () => setLetter(letter, false)]),
    ),
    { event: "keyup" },
  );

  // If the tab loses focus mid-press the keyup never arrives — release
  // everything so no cap gets stuck down.
  useEffect(() => {
    const releaseAll = () => setHeld({});
    window.addEventListener("blur", releaseAll);
    return () => window.removeEventListener("blur", releaseAll);
  }, []);

  return (
    <h1 className="hero-keys mt-6">
      <span className="sr-only">Keyboardist</span>
      <span aria-hidden className="keys">
        {LETTERS.map((letter) => (
          <span key={letter} className={held[letter] ? "key pressed" : "key"}>
            {letter.toUpperCase()}
          </span>
        ))}
      </span>
    </h1>
  );
}

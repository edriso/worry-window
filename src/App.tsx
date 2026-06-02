import { useEffect, useState } from 'react';
import { SettingsOverlay } from '@/components/settings-overlay';
import { useApplyAccent } from '@/hooks/use-apply-accent';
import { formatAgo, isWindowOpen } from '@/lib/window';
import { useWorryStore } from '@/store/worry-store';

let idCounter = 0;
function newId(): string {
  idCounter += 1;
  return `w${Date.now()}-${idCounter}`;
}

export function App() {
  useApplyAccent();
  const { windowTime, windowMin } = useWorryStore((state) => state.settings);
  const worries = useWorryStore((state) => state.worries);
  const add = useWorryStore((state) => state.add);
  const remove = useWorryStore((state) => state.remove);
  const clearAll = useWorryStore((state) => state.clearAll);

  const [draft, setDraft] = useState('');
  const [now, setNow] = useState(() => new Date());
  const [session, setSession] = useState(false);
  const [left, setLeft] = useState(windowMin * 60);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 20000);
    return () => clearInterval(id);
  }, []);

  // The worry-session countdown.
  useEffect(() => {
    if (!session) {
      return;
    }
    setLeft(windowMin * 60);
    let secondsLeft = windowMin * 60;
    const id = setInterval(() => {
      secondsLeft -= 1;
      setLeft(secondsLeft);
      if (secondsLeft <= 0) {
        clearInterval(id);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [session, windowMin]);

  function submit() {
    if (!draft.trim()) {
      return;
    }
    add(draft, Date.now(), newId());
    setDraft('');
  }

  const open = isWindowOpen(windowTime, windowMin, now);

  if (session) {
    const mm = Math.floor(left / 60);
    const ss = left % 60;
    return (
      <div className="app">
        <div className="col">
          <div className="session rise">
            <button
              className="corner"
              type="button"
              onClick={() => setSession(false)}
              aria-label="Close"
            >
              ✕
            </button>
            <div className="word">Worry Window</div>
            {left > 0 ? (
              <>
                <h1 className="h1">This is the time.</h1>
                <p className="sub">
                  For these {windowMin} minutes, let yourself fully think about each one. Then we
                  close the window.
                </p>
                <div className="timer" aria-live="polite">
                  {mm}:{String(ss).padStart(2, '0')} of worry time
                </div>
                <div style={{ width: '100%' }}>
                  {worries.length > 0 ? (
                    worries.map((w) => (
                      <div key={w.id} className="ses-worry">
                        {w.txt}
                      </div>
                    ))
                  ) : (
                    <p className="empty">No worries parked. A quiet day.</p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                  <button className="cta ghost" type="button" onClick={() => setSession(false)}>
                    Pause
                  </button>
                  <button
                    className="cta"
                    type="button"
                    onClick={() => {
                      clearAll();
                      setSession(false);
                    }}
                  >
                    Close the window
                  </button>
                </div>
              </>
            ) : (
              <>
                <h1 className="h1">Time&rsquo;s up.</h1>
                <p className="sub">
                  The window&rsquo;s closed. Notice how many of these already feel smaller. Let them
                  go until tomorrow.
                </p>
                <button
                  className="cta"
                  type="button"
                  onClick={() => {
                    clearAll();
                    setSession(false);
                  }}
                >
                  Clear &amp; close
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="col">
        <button
          className="corner corner-l"
          type="button"
          onClick={() => setSettingsOpen(true)}
          aria-label="Settings"
        >
          ⚙
        </button>
        <div className="word">Worry Window</div>
        <p className="sub">
          A worry shows up? Park it here. You&rsquo;ll deal with all of them at once, at{' '}
          {windowTime} — not all day long.
        </p>
        <div className="add">
          <input
            className="field"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="What's worrying you? Park it…"
            aria-label="What's worrying you?"
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit();
            }}
          />
          <button className="iconbtn" type="button" onClick={submit} aria-label="Park worry">
            +
          </button>
        </div>

        <div className="window-card rise">
          <div className="wc-ic" aria-hidden="true">
            🪟
          </div>
          <div>
            <div className="wc-t">
              {open ? 'Your worry window is open' : `Opens at ${windowTime}`}
            </div>
            <div className="wc-s">
              {open
                ? `${windowMin} minutes to face them`
                : `${worries.length} parked · they'll keep`}
            </div>
          </div>
          {open && (
            <button className="wc-go" type="button" onClick={() => setSession(true)}>
              Open now
            </button>
          )}
        </div>

        {worries.length > 0 ? (
          <>
            <div className="label">Parked · {worries.length}</div>
            {worries.map((w) => (
              <div key={w.id} className="worry rise">
                <div>
                  <div className="wt">{w.txt}</div>
                  <div className="wm">{formatAgo(w.at, now.getTime())} · set aside</div>
                </div>
                <button
                  className="wx"
                  type="button"
                  onClick={() => remove(w.id)}
                  aria-label={`Remove: ${w.txt}`}
                >
                  ✕
                </button>
              </div>
            ))}
            <div style={{ textAlign: 'center', marginTop: 14 }}>
              <button className="cta ghost" type="button" onClick={() => setSession(true)}>
                Open worry time early
              </button>
            </div>
          </>
        ) : (
          <div className="empty">
            Nothing parked. When a worry interrupts you, drop it here and get back to your day — it
            will wait for the window.
          </div>
        )}
      </div>

      {settingsOpen && <SettingsOverlay onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}

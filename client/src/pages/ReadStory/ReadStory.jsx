import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChatContact from "../../components/ChatContact/ChatContact.jsx";
import ChatBubble from "../../components/ChatBubble/ChatBubble.jsx";
import styles from "./ReadStory.module.css";
import bliss from "../../assets/bliss.jpg";
import pfp from "../../assets/pfp.svg";

function ReadStory() {
  const { storyId, segmentId } = useParams();
  const navigate = useNavigate();

  const [story, setStory] = useState(null);
  const [segment, setSegment] = useState(null);
  const [comments, setComments] = useState([]);
  const [rating, setRating] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFollowingAuthor, setIsFollowingAuthor] = useState(false);
  const [createModal, setCreateModal] = useState(null);
  const [draftSegment, setDraftSegment] = useState({
    title: "",
    content: "",
    image_url: "",
  });
  const [draftChoices, setDraftChoices] = useState([""]);
  const [editModal, setEditModal] = useState(false);
  const [editSegment, setEditSegment] = useState({
    title: "",
    content: "",
    image_url: "",
    is_terminal: false,
  });
  const [editChoices, setEditChoices] = useState([]);
  const [editError, setEditError] = useState(null);
  const [editSuccess, setEditSuccess] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [choiceModal, setChoiceModal] = useState(null); // { choiceId, segments }
  const [branchChoiceId, setBranchChoiceId] = useState(null);

  const coverImage = useMemo(() => {
    const val = segment?.image_url || story?.cover_image_url;
    if (!val) return bliss;
    if (typeof val === "string" && val.startsWith("http")) return val;
    const trimmed = (val || "").replace(/^\/+/, "");
    if (trimmed.startsWith("storage/"))
      return `${window.location.origin}/${trimmed}`;
    if (trimmed.startsWith("uploads/"))
      return `${window.location.origin}/storage/${trimmed}`;
    return `${window.location.origin}/storage/uploads/${trimmed}`;
  }, [segment, story]);
  const userId = 1;
  const ownerId = story?.owner?.id ? Number(story.owner.id) : null;
  const authorId = segment?.author?.id ? Number(segment.author.id) : null;
  const canInteract = !!segment?.id;
  const canContribute =
    !!story?.is_collaborative || (ownerId && userId && ownerId === userId);
  const canEdit =
    (authorId && userId && authorId === userId) ||
    (ownerId && userId && ownerId === userId);

  const pushHistory = (id) => {
    if (!id) return;
    setHistory((prev) => {
      const next = prev.slice(0, historyIndex + 1);
      next.push(id);
      setHistoryIndex(next.length - 1);
      return next;
    });
  };

  const requireAuth = () => {
    return true;
  };

  const normalize = (payload) => resourceData(payload) ?? payload;

  const openEdit = () => {
    if (!canEdit) return;
    setEditSegment({
      title: segment?.title || "",
      content: segment?.content || "",
      image_url: segment?.image_url || "",
      is_terminal: !!segment?.is_terminal,
    });
    setEditChoices(
      (segment?.choices || []).map((c, idx) => ({
        id: c.id,
        label: c.label,
        position: c.position ?? idx,
        next_segment_id: c.next_segment_id,
      })),
    );
    setEditModal(true);
  };

  const updateEditField = (e) => {
    const { name, value, type, checked } = e.target;
    setEditSegment((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const updateEditChoice = (index, value) => {
    setEditChoices((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], label: value };
      return next;
    });
  };

  const addEditChoice = () =>
    setEditChoices((prev) => [
      ...prev,
      { id: null, label: "", position: prev.length },
    ]);

  const removeEditChoice = (index) => {
    setEditChoices((prev) => prev.filter((_, idx) => idx !== index));
  };

  const openBranchForm = (choice) => {
    if (!canContribute) {
      setError("Connecte-toi pour contribuer à cette branche.");
      return;
    }
    setCreateModal({
      choiceId: choice.id,
      choiceLabel: choice.label,
    });
    setBranchChoiceId(choice?.id ?? (segment?.choices?.[0]?.id || null));
    setDraftSegment({ title: "", content: "", image_url: "" });
    setDraftChoices(["", ""]);
  };

  const closeBranchForm = () => {
    setCreateModal(null);
    setBranchChoiceId(null);
  };

  const updateDraftField = (e) => {
    const { name, value } = e.target;
    setDraftSegment((prev) => ({ ...prev, [name]: value }));
  };

  const updateDraftChoice = (index, value) => {
    setDraftChoices((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const addDraftChoice = () => setDraftChoices((prev) => [...prev, ""]);
  const removeDraftChoice = (index) =>
    setDraftChoices((prev) => prev.filter((_, idx) => idx !== index));

  if (isLoading && !segment) {
    return (
      <div className={styles.page}>
        <p>Chargement...</p>
      </div>
    );
  }

  if (error && !segment) {
    return (
      <div className={styles.page}>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.main}>
        <div className={styles.headerRow}>
          <div>
            <p className={styles.kicker}>Currently Reading</p>
            <h2>{segment?.title || "Segment"}</h2>
            {story?.title && (
              <p className={styles.subtitle}>Story: {story.title}</p>
            )}
          </div>
          {segment?.id && (
            <div className={styles.badge}>Segment #{segment.id}</div>
          )}
        </div>

        <img
          className={styles.seg_pic}
          src={coverImage}
          alt={segment?.title || "Segment"}
        />

        <p className={styles.paragraph}>
          {segment?.content || "No content available."}
        </p>

        <div className={styles.choices}>
          {segment?.choices?.map((choice) => (
            <div key={choice.id} className={styles.choiceItem}>
              <button
                className={styles.choice_button}
                onClick={() => handleChoice(choice)}
                disabled={
                  (!choice.next_segment_id && !canContribute) || isLoading
                }
              >
                {choice.label}
              </button>
              {!choice.next_segment_id && (
                <div className={styles.choiceMeta}>
                  <span className={styles.choiceHint}>
                    Pas encore de suite.
                  </span>
                  {canContribute ? (
                    <button
                      type="button"
                      className={styles.addBranchBtn}
                      onClick={() => openBranchForm(choice)}
                      disabled={isSubmitting || isLoading}
                    >
                      Ajouter un segment
                    </button>
                  ) : (
                    <span className={styles.choiceHint}>
                      Connecte-toi pour contribuer.
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
          {canContribute && (
            <div className={styles.choiceItem}>
              <button
                className={styles.choice_button}
                onClick={() =>
                  openBranchForm({ id: null, label: "Nouvelle branche" })
                }
                disabled={isSubmitting || isLoading}
              >
                Ajouter un segment
              </button>
              <div className={styles.choiceMeta}>
                <span className={styles.choiceHint}>
                  Créer un nouveau choix et segment
                </span>
              </div>
            </div>
          )}
          {!segment?.choices?.length && (
            <p style={{ color: "var(--muted)" }}>
              No choices for this segment.
            </p>
          )}
        </div>

        <div className={styles.author_rating}>
          <div className={styles.authorBlock}>
            <ChatContact
              src={segment?.author?.avatar_url || pfp}
              username={
                segment?.author?.display_name ||
                segment?.author?.username ||
                "Unknown"
              }
            />
            {story?.owner?.id && story?.owner?.id !== 1 && (
              <button
                className={styles.followBtn}
                onClick={() =>
                  isFollowingAuthor
                    ? handleUnfollowAuthor(story.owner.id)
                    : handleFollowAuthor(story.owner.id)
                }
                disabled={isSubmitting}
              >
                {isFollowingAuthor ? "Unfollow author" : "Follow author"}
              </button>
            )}
          </div>
          <select
            name="rating"
            value={rating}
            onChange={(e) => handleRating(e.target.value)}
            disabled={!canInteract || isSubmitting || isLoading}
          >
            <option value="" disabled hidden>
              Rate this segment
            </option>
            <option value="1">⭐ 1 Star</option>
            <option value="2">⭐ 2 Stars</option>
            <option value="3">⭐ 3 Stars</option>
            <option value="4">⭐ 4 Stars</option>
            <option value="5">⭐ 5 Stars</option>
          </select>
          <span className={styles.ratingStat}>
            {segment?.rating?.average ?? "—"} ({segment?.rating?.count ?? 0})
          </span>
        </div>

        <div className={styles.seg_stats}>
          <div className={styles.date_views}>
            <div>
              Date{" "}
              {segment?.created_at
                ? new Date(segment.created_at).toLocaleDateString()
                : "—"}
            </div>
            <div>
              Author{" "}
              {segment?.author?.display_name ||
                segment?.author?.username ||
                "—"}
            </div>
          </div>
          <div className={styles.actions}>
            <button
              className={styles.rate_fave_book}
              disabled={!canInteract || isSubmitting || isLoading}
            >
              {isFavorited ? "💔 Unfavorite" : "❤️ Favorite"}
            </button>
            <button
              className={styles.rate_fave_book}
              disabled={!canInteract || isSubmitting || isLoading}
            >
              {isBookmarked ? "🔖 Bookmarked" : "🔖 Bookmark"}
            </button>
            {canEdit && (
              <>
                <button
                  className={styles.rate_fave_book}
                  onClick={openEdit}
                  disabled={isSubmitting || isLoading}
                >
                  ✏️ Edit
                </button>
                <button
                  className={styles.rate_fave_book}
                  onClick={deleteSegment}
                  disabled={isSubmitting || isLoading}
                >
                  🗑️ Delete
                </button>
              </>
            )}
          </div>
          {/* <div className={styles.navHistory}>
              <button className={styles.rate_fave_book} onClick={handlePrevSegment} disabled={historyIndex <= 0 || isLoading}>
                ⬅️ Back
              </button>
              <button className={styles.rate_fave_book} onClick={handleNextSegment} disabled={historyIndex === -1 || historyIndex >= history.length - 1 || isLoading}>
                Next ➡️
              </button>
            </div> */}
        </div>

        {error && <div style={{ color: "red", marginTop: "8px" }}>{error}</div>}

        <form>
          <textarea
            className={styles.comment_area}
            name="comment"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className="btn primary"
            disabled={isSubmitting || !commentInput.trim()}
          >
            {isSubmitting ? "Sending..." : "Submit"}
          </button>
        </form>

        <h3 className={styles.commentsTitle}>
          Comments ({comments?.length ?? 0})
        </h3>
        <div className={styles.comment_bubbles}>
          {comments?.map((c, index) => {
            const author = c.author || {};
            return (
              <ChatBubble
                key={c.id || index}
                src={author.avatar_url || pfp}
                username={"User"}
                message={c.body}
                timestamp={
                  c.created_at ? new Date(c.created_at).toLocaleString() : ""
                }
              />
            );
          })}
          {!comments?.length && (
            <p style={{ color: "var(--muted)" }}>No comments yet.</p>
          )}
        </div>
      </div>

      {createModal && (
        <div className={styles.modalBg} onClick={closeBranchForm}>
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>Continuer la branche “{createModal.choiceLabel}”</h3>
              <button className={styles.closeBtn} onClick={closeBranchForm}>
                ✕
              </button>
            </div>
            <div className={styles.formGrid}>
              <label className={styles.field}>
                Titre (optionnel)
                <input
                  name="title"
                  value={draftSegment.title}
                  onChange={updateDraftField}
                  placeholder="Nouveau segment..."
                />
              </label>
              <label className={styles.field}>
                Relier à un choix existant
                <select
                  value={branchChoiceId || ""}
                  onChange={(e) =>
                    setBranchChoiceId(
                      e.target.value ? Number(e.target.value) : null,
                    )
                  }
                >
                  <option value="">Sélectionner un choix</option>
                  {(segment?.choices || []).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label || `Choix #${c.id}`}
                    </option>
                  ))}
                </select>
              </label>
              <label className={`${styles.field} ${styles.full}`}>
                Contenu
                <textarea
                  name="content"
                  value={draftSegment.content}
                  onChange={updateDraftField}
                  placeholder="Rédige la suite ici..."
                  rows={4}
                />
              </label>
              <label className={styles.field}>
                Image (URL)
                <input
                  name="image_url"
                  value={draftSegment.image_url}
                  onChange={updateDraftField}
                  placeholder="https://..."
                />
              </label>
            </div>

            <div className={styles.choicesEditor}>
              <div className={styles.choiceEditorHeader}>
                <span>Choix suivants (optionnel)</span>
                <button
                  type="button"
                  className={styles.smallGhost}
                  onClick={addDraftChoice}
                >
                  + Ajouter un choix
                </button>
              </div>
              {draftChoices.map((c, idx) => (
                <div key={idx} className={styles.choiceRow}>
                  <input
                    value={c}
                    onChange={(e) => updateDraftChoice(idx, e.target.value)}
                    placeholder={`Choix ${idx + 1}`}
                  />
                  {draftChoices.length > 1 && (
                    <button
                      type="button"
                      className={styles.smallGhost}
                      onClick={() => removeDraftChoice(idx)}
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className={styles.modalActions}>
              <button
                className="btn ghost"
                onClick={closeBranchForm}
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button
                className="btn primary"
                onClick={submitBranch}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Création..." : "Créer et poursuivre"}
              </button>
            </div>
          </div>
        </div>
      )}

      {choiceModal && (
        <div className={styles.modalBg} onClick={() => setChoiceModal(null)}>
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>Choisir un segment</h3>
              <button
                className={styles.closeBtn}
                onClick={() => setChoiceModal(null)}
              >
                ✕
              </button>
            </div>
            <p className={styles.choiceHint}>
              Segments disponibles pour “{choiceModal.choiceLabel || "Choix"}”
            </p>
            <div className={styles.choiceList}>
              {choiceModal.segments?.map((seg) => (
                <button
                  key={seg.id}
                  className={styles.choice_button}
                  style={{ width: "100%", justifyContent: "flex-start" }}
                  disabled={isLoading}
                >
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: 700 }}>
                      {seg.title || `Segment #${seg.id}`}
                    </div>
                    <div className={styles.choiceHint}>
                      {(seg.content || "").slice(0, 120)}...
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {(!choiceModal.segments || !choiceModal.segments.length) && (
              <p style={{ color: "var(--muted)" }}>
                Aucun segment pour ce choix.
              </p>
            )}
          </div>
        </div>
      )}

      {editModal && (
        <div className={styles.modalBg} onClick={() => setEditModal(false)}>
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>Modifier le segment</h3>
              <button
                className={styles.closeBtn}
                onClick={() => setEditModal(false)}
              >
                ✕
              </button>
            </div>
            {editError && <div style={{ color: "red" }}>{editError}</div>}
            {editSuccess && <div style={{ color: "green" }}>{editSuccess}</div>}
            <div className={styles.formGrid}>
              <label className={styles.field}>
                Titre
                <input
                  name="title"
                  value={editSegment.title}
                  onChange={updateEditField}
                  placeholder="Titre..."
                />
              </label>
              <label className={`${styles.field} ${styles.full}`}>
                Contenu
                <textarea
                  name="content"
                  value={editSegment.content}
                  onChange={updateEditField}
                  rows={4}
                />
              </label>
              <label className={styles.field}>
                Image (URL)
                <input
                  name="image_url"
                  value={editSegment.image_url}
                  onChange={updateEditField}
                  placeholder="https://..."
                />
              </label>
              <label className={styles.field}>
                <span>Terminal ?</span>
                <input
                  type="checkbox"
                  name="is_terminal"
                  checked={editSegment.is_terminal}
                  onChange={updateEditField}
                />
              </label>
            </div>

            <div className={styles.choicesEditor}>
              <div className={styles.choiceEditorHeader}>
                <span>Choix</span>
                <button
                  type="button"
                  className={styles.smallGhost}
                  onClick={addEditChoice}
                >
                  + Ajouter
                </button>
              </div>
              {editChoices.map((c, idx) => (
                <div key={c.id || idx} className={styles.choiceRow}>
                  <input
                    value={c.label}
                    onChange={(e) => updateEditChoice(idx, e.target.value)}
                    placeholder={`Choix ${idx + 1}`}
                  />
                  {c.next_segment_id ? (
                    <span className={styles.choiceHint}>Lié à un segment</span>
                  ) : (
                    <button
                      type="button"
                      className={styles.smallGhost}
                      onClick={() => removeEditChoice(idx)}
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              ))}
              {!editChoices.length && (
                <span className={styles.choiceHint}>
                  Aucun choix pour l’instant.
                </span>
              )}
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                className="btn ghost"
                onClick={() => setEditModal(false)}
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn primary"
                onClick={submitEdit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReadStory;

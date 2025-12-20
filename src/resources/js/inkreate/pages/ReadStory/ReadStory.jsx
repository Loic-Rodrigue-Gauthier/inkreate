import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ChatContact from '../../components/ChatContact/ChatContact';
import ChatBubble from '../../components/ChatBubble/ChatBubble';
import styles from './ReadStory.module.css';
import bliss from '../../assets/bliss.jpg';
import pfp from '../../assets/pfp.svg';
import { api, resourceData } from '../../services/apiClient';
import { useAuth } from '../../context/AuthContext.jsx';

function ReadStory() {
  const { storyId, segmentId } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [story, setStory] = useState(null);
  const [segment, setSegment] = useState(null);
  const [comments, setComments] = useState([]);
  const [rating, setRating] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFollowingAuthor, setIsFollowingAuthor] = useState(false);
  const [createModal, setCreateModal] = useState(null);
  const [draftSegment, setDraftSegment] = useState({ title: '', content: '', image_url: '' });
  const [draftChoices, setDraftChoices] = useState(['']);
  const [editModal, setEditModal] = useState(false);
  const [editSegment, setEditSegment] = useState({ title: '', content: '', image_url: '', is_terminal: false });
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
    if (typeof val === 'string' && val.startsWith('http')) return val;
    const trimmed = (val || '').replace(/^\/+/, '');
    if (trimmed.startsWith('storage/')) return `${window.location.origin}/${trimmed}`;
    if (trimmed.startsWith('uploads/')) return `${window.location.origin}/storage/${trimmed}`;
    return `${window.location.origin}/storage/uploads/${trimmed}`;
  }, [segment, story]);
  const userId = user?.id ? Number(user.id) : null;
  const ownerId = story?.owner?.id ? Number(story.owner.id) : null;
  const authorId = segment?.author?.id ? Number(segment.author.id) : null;
  const canInteract = !!(token && segment?.id);
  const canContribute = !!token && (!!story?.is_collaborative || (ownerId && userId && ownerId === userId));
  const canEdit = !!token && ((authorId && userId && authorId === userId) || (ownerId && userId && ownerId === userId));

  const pushHistory = (id) => {
    if (!id) return;
    setHistory((prev) => {
      const next = prev.slice(0, historyIndex + 1);
      next.push(id);
      setHistoryIndex(next.length - 1);
      return next;
    });
  };

  useEffect(() => {
    loadInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyId, segmentId]);

  const requireAuth = () => {
    if (!token) {
      setError('Connecte-toi pour continuer.');
      return false;
    }
    return true;
  };

  const normalize = (payload) => resourceData(payload) ?? payload;

  const loadStory = async (id) => {
    const data = await api.story(id, { with_root: 1 });
    return normalize(data);
  };

  const loadSegment = async (id, pushUrl = true, fromHistory = false) => {
    const data = await api.segment(id, token);
    const seg = normalize(data);
    setSegment(seg);
    setComments(normalize(seg.comments) ?? []);
    setRating('');
    if (pushUrl && seg?.story_id && seg?.id) {
      navigate(`/read-story/${seg.story_id}/${seg.id}`, { replace: true });
    }
    if (!fromHistory && seg?.id) {
      pushHistory(seg.id);
    }
    return seg;
  };

  const loadInitial = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let currentSegment = null;
      let currentStory = null;

      if (segmentId) {
        currentSegment = await loadSegment(segmentId, false);
        currentStory = await loadStory(currentSegment.story_id);
      } else if (storyId) {
        currentStory = await loadStory(storyId);
        const first = currentStory?.root_segments?.[0];
        if (first?.id) {
          currentSegment = await loadSegment(first.id, false);
        }
      } else {
        // Fallback: grab first story with a root segment
        const list = await api.stories({ per_page: 1, with_root: 1 });
        const firstStory = normalize(list).data?.[0] ?? normalize(list)[0];
        if (firstStory?.id) {
          currentStory = await loadStory(firstStory.id);
          const first = currentStory?.root_segments?.[0];
          if (first?.id) currentSegment = await loadSegment(first.id, false);
        }
      }

      setStory(currentStory);
      setSegment(currentSegment);
      setComments(normalize(currentSegment?.comments) ?? []);
      if (currentSegment?.id) {
        pushHistory(currentSegment.id);
      }
      if (token && currentStory?.owner?.id) {
        api.isFollowing(token, currentStory.owner.id)
          .then((res) => setIsFollowingAuthor(!!res.following))
          .catch(() => setIsFollowingAuthor(false));
      }
      if (token && currentSegment?.bookmarked) {
        setIsBookmarked(true);
      } else {
        setIsBookmarked(false);
      }
      if (token && currentStory?.id) {
        api.favorites(token)
          .then((res) => {
            const favs = normalize(res) || [];
            const isFav = favs.some((f) => f.id === currentStory.id);
            setIsFavorited(isFav);
          })
          .catch(() => setIsFavorited(false));
      }
      if (currentSegment) {
        navigate(`/read-story/${currentSegment.story_id}/${currentSegment.id}`, { replace: true });
      }
    } catch (e) {
      setError(e?.message || 'Impossible de charger cette histoire.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChoice = async (choice) => {
    setIsLoading(true);
    setError(null);
    try {
      const choiceId = choice.id;
      const segments = choiceId ? normalize(await api.choiceSegments(token, story.id, choiceId)) : [];
      if (segments.length === 1) {
        await loadSegment(segments[0].id);
      } else if (segments.length > 1) {
        setChoiceModal({ choiceId, choiceLabel: choice.label, segments });
      } else if (choice.next_segment_id) {
        await loadSegment(choice.next_segment_id);
      } else if (canContribute) {
        openBranchForm(choice);
      } else {
        setError('Pas encore de suite disponible.');
      }
    } catch (e) {
      setError('Impossible de charger le segment suivant.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!requireAuth() || !story?.id) return;
    setIsSubmitting(true);
    try {
      if (isFavorited) {
        await api.unfavoriteStory(token, story.id);
        setIsFavorited(false);
      } else {
        await api.favoriteStory(token, story.id);
        setIsFavorited(true);
      }
      window.dispatchEvent(new CustomEvent('favorites:update'));
    } catch (e) {
      setError("Impossible de mettre à jour les favoris.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookmark = async () => {
    if (!requireAuth() || !segment?.id) return;
    setIsSubmitting(true);
    try {
      await api.bookmarkSegment(token, segment.id, { progress_percentage: 0 });
      setIsBookmarked(true);
      window.dispatchEvent(new CustomEvent('bookmarks:update'));
    } catch (e) {
      setError("Impossible d'enregistrer le signet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFollowAuthor = async (authorId) => {
    if (!requireAuth()) return;
    setIsSubmitting(true);
    try {
      await api.followUser(token, authorId);
      setIsFollowingAuthor(true);
    } catch (_e) {
      setError('Unable to follow this author.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnfollowAuthor = async (authorId) => {
    if (!requireAuth()) return;
    setIsSubmitting(true);
    try {
      await api.unfollowUser(token, authorId);
      setIsFollowingAuthor(false);
    } catch (_e) {
      setError('Unable to unfollow this author.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRating = async (value) => {
    if (!requireAuth() || !segment?.id) return;
    setRating(value);
    setIsSubmitting(true);
    try {
      await api.rateSegment(token, segment.id, { score: Number(value) });
      // Optionally refresh segment rating
      const updated = await loadSegment(segment.id, false);
      setSegment(updated);
    } catch (e) {
      setError("Impossible d'enregistrer la note.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!requireAuth() || !segment?.id || !commentInput.trim()) return;
    setIsSubmitting(true);
    try {
      const created = await api.commentSegment(token, segment.id, { body: commentInput.trim() });
      const newComment = normalize(created);
      setComments((prev) => [...prev, newComment]);
      setCommentInput('');
    } catch (err) {
      setError('Impossible de publier le commentaire.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEdit = () => {
    if (!canEdit) return;
    setEditSegment({
      title: segment?.title || '',
      content: segment?.content || '',
      image_url: segment?.image_url || '',
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
    setEditSegment((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const updateEditChoice = (index, value) => {
    setEditChoices((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], label: value };
      return next;
    });
  };

  const addEditChoice = () => setEditChoices((prev) => [...prev, { id: null, label: '', position: prev.length }]);

  const removeEditChoice = (index) => {
    setEditChoices((prev) => prev.filter((_, idx) => idx !== index));
  };

  const submitEdit = async () => {
    if (!requireAuth() || !segment?.id) return;
    if (!editSegment.content.trim()) {
      setError('Le contenu est requis.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    setEditError(null);
    setEditSuccess(null);
    try {
      const payload = {
        title: editSegment.title,
        content: editSegment.content,
        image_url: editSegment.image_url || null,
        is_terminal: editSegment.is_terminal,
        ...(editChoices.length
          ? {
              choices: editChoices.map((c, idx) => ({
                id: c.id || undefined,
                label: c.label || `Choix ${idx + 1}`,
                position: idx,
              })),
            }
          : {}),
      };
      await api.updateSegment(token, segment.id, payload);
      // Recharge le segment pour refléter les changements
      await loadSegment(segment.id, true);
      setEditModal(false);
      setEditSuccess('Segment mis à jour.');
    } catch (err) {
      const msg = err?.message || 'Impossible de mettre à jour le segment.';
      setError(msg);
      setEditError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevSegment = async () => {
    if (historyIndex <= 0) return;
    const targetId = history[historyIndex - 1];
    setHistoryIndex(historyIndex - 1);
    await loadSegment(targetId, true, true);
  };

  const handleNextSegment = async () => {
    if (historyIndex === -1 || historyIndex >= history.length - 1) return;
    const targetId = history[historyIndex + 1];
    setHistoryIndex(historyIndex + 1);
    await loadSegment(targetId, true, true);
  };

  const deleteSegment = async () => {
    if (!requireAuth() || !segment?.id) return;
    // eslint-disable-next-line no-alert
    const confirmed = window.confirm('Supprimer ce segment ? Cette action est définitive.');
    if (!confirmed) return;
    setIsSubmitting(true);
    try {
      await api.deleteSegment(token, segment.id);
      // Nettoyer l’état local et rediriger
      setSegment(null);
      setStory(null);
      navigate('/home', { replace: true });
    } catch (err) {
      setError(err?.message || 'Suppression impossible.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openBranchForm = (choice) => {
    if (!canContribute) {
      setError('Connecte-toi pour contribuer à cette branche.');
      return;
    }
    setCreateModal({
      choiceId: choice.id,
      choiceLabel: choice.label,
    });
    setBranchChoiceId(choice?.id ?? (segment?.choices?.[0]?.id || null));
    setDraftSegment({ title: '', content: '', image_url: '' });
    setDraftChoices(['', '']);
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

  const addDraftChoice = () => setDraftChoices((prev) => [...prev, '']);
  const removeDraftChoice = (index) => setDraftChoices((prev) => prev.filter((_, idx) => idx !== index));

  const submitBranch = async () => {
    if (!requireAuth() || !story?.id || !segment?.id || !createModal) return;
    if (!draftSegment.content.trim()) {
      setError('Ajoute du contenu pour le nouveau segment.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      let parentChoiceId = branchChoiceId || createModal.choiceId;
      // Si aucun choix parent sélectionné, on en crée un rapidement pour brancher le nouveau segment.
      if (!parentChoiceId) {
        const label =
          draftSegment.title?.trim() ||
          draftChoices[0]?.trim() ||
          createModal.choiceLabel ||
          'Nouveau choix';
        const createdChoiceRes = await api.addChoice(token, segment.id, {
          label,
          position: (segment?.choices?.length ?? 0),
        });
        const choicePayload = normalize(createdChoiceRes);
        const newChoice = (choicePayload?.choices || []).slice(-1)[0];
        parentChoiceId = newChoice?.id || null;
      }

      const payload = {
        title: draftSegment.title || `Branch of ${segment.title || 'segment'}`,
        content: draftSegment.content.trim(),
        image_url: draftSegment.image_url || undefined,
        parent_segment_id: segment.id,
        parent_choice_id: parentChoiceId,
        choices: draftChoices.map((c) => c.trim()).filter(Boolean),
      };
      const created = await api.createSegment(token, story.id, payload);
      const newSegment = normalize(created);
      setCreateModal(null);
      setBranchChoiceId(null);
      setDraftChoices(['']);
      setDraftSegment({ title: '', content: '', image_url: '' });
      await loadSegment(newSegment.id);
    } catch (err) {
      setError(err?.message || 'Impossible de créer le segment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && !segment) {
    return <div className={styles.page}><p>Chargement...</p></div>;
  }

  if (error && !segment) {
    return <div className={styles.page}><p style={{ color: 'red' }}>{error}</p></div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.main}>
        <div className={styles.headerRow}>
          <div>
            <p className={styles.kicker}>Currently Reading</p>
            <h2>{segment?.title || 'Segment'}</h2>
            {story?.title && <p className={styles.subtitle}>Story: {story.title}</p>}
          </div>
          {segment?.id && <div className={styles.badge}>Segment #{segment.id}</div>}
        </div>

        <img className={styles.seg_pic} src={coverImage} alt={segment?.title || 'Segment'} />

        <p className={styles.paragraph}>{segment?.content || 'No content available.'}</p>

        <div className={styles.choices}>
          {segment?.choices?.map((choice) => (
            <div key={choice.id} className={styles.choiceItem}>
              <button
                className={styles.choice_button}
                onClick={() => handleChoice(choice)}
                disabled={(!choice.next_segment_id && !canContribute) || isLoading}
              >
                {choice.label}
              </button>
              {!choice.next_segment_id && (
                <div className={styles.choiceMeta}>
                  <span className={styles.choiceHint}>Pas encore de suite.</span>
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
                    <span className={styles.choiceHint}>Connecte-toi pour contribuer.</span>
                  )}
                </div>
              )}
            </div>
          ))}
          {canContribute && (
            <div className={styles.choiceItem}>
              <button
                className={styles.choice_button}
                onClick={() => openBranchForm({ id: null, label: 'Nouvelle branche' })}
                disabled={isSubmitting || isLoading}
              >
                Ajouter un segment
              </button>
              <div className={styles.choiceMeta}>
                <span className={styles.choiceHint}>Créer un nouveau choix et segment</span>
              </div>
            </div>
          )}
          {!segment?.choices?.length && <p style={{ color: 'var(--muted)' }}>No choices for this segment.</p>}
        </div>

        <div className={styles.author_rating}>
          <div className={styles.authorBlock}>
            <ChatContact src={segment?.author?.avatar_url || pfp} username={segment?.author?.display_name || segment?.author?.username || 'Unknown'} />
            {story?.owner?.id && story?.owner?.id !== user?.id && (
              <button
                className={styles.followBtn}
                onClick={() => (isFollowingAuthor ? handleUnfollowAuthor(story.owner.id) : handleFollowAuthor(story.owner.id))}
                disabled={!token || isSubmitting}
              >
                {isFollowingAuthor ? 'Unfollow author' : 'Follow author'}
              </button>
            )}
          </div>
          <select
            name="rating"
            value={rating}
            onChange={(e) => handleRating(e.target.value)}
            disabled={!canInteract || isSubmitting || isLoading}
          >
            <option value="" disabled hidden>Rate this segment</option>
            <option value="1">⭐ 1 Star</option>
            <option value="2">⭐ 2 Stars</option>
            <option value="3">⭐ 3 Stars</option>
            <option value="4">⭐ 4 Stars</option>
            <option value="5">⭐ 5 Stars</option>
          </select>
          <span className={styles.ratingStat}>
            {segment?.rating?.average ?? '—'} ({segment?.rating?.count ?? 0})
          </span>
        </div>

        <div className={styles.seg_stats}>
          <div className={styles.date_views}>
            <div>Date {segment?.created_at ? new Date(segment.created_at).toLocaleDateString() : '—'}</div>
            <div>Author {segment?.author?.display_name || segment?.author?.username || '—'}</div>
          </div>
          <div className={styles.actions}>
            <button
              className={styles.rate_fave_book}
              onClick={handleFavorite}
              disabled={!canInteract || isSubmitting || isLoading}
            >
              {isFavorited ? '💔 Unfavorite' : '❤️ Favorite'}
            </button>
            <button
              className={styles.rate_fave_book}
              onClick={handleBookmark}
              disabled={!canInteract || isSubmitting || isLoading}
            >
              {isBookmarked ? '🔖 Bookmarked' : '🔖 Bookmark'}
            </button>
              {canEdit && (
                <>
                  <button className={styles.rate_fave_book} onClick={openEdit} disabled={isSubmitting || isLoading}>
                    ✏️ Edit
                  </button>
                  <button className={styles.rate_fave_book} onClick={deleteSegment} disabled={isSubmitting || isLoading}>
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

        {error && <div style={{ color: 'red', marginTop: '8px' }}>{error}</div>}
        {!token && <div style={{ color: 'var(--muted)', marginTop: '4px' }}>Login to rate, favorite, bookmark, and comment.</div>}

        <form onSubmit={handleComment}>
          <textarea
            className={styles.comment_area}
            placeholder={token ? 'Comment on this segment!' : 'Connecte-toi pour commenter.'}
            name="comment"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            disabled={!token || isSubmitting}
          />
          <button type="submit" className="btn primary" disabled={!token || isSubmitting || !commentInput.trim()}>
            {isSubmitting ? 'Sending...' : 'Send Comment'}
          </button>
        </form>

        <h3 className={styles.commentsTitle}>Comments ({comments?.length ?? 0})</h3>
        <div className={styles.comment_bubbles}>
          {comments?.map((c, index) => {
            const author = c.user || c.author || {};
            return (
              <ChatBubble
                key={c.id || index}
                src={author.avatar_url || pfp}
                username={author.display_name || author.username || 'User'}
                message={c.body}
                timestamp={c.created_at ? new Date(c.created_at).toLocaleString() : ''}
              />
            );
          })}
          {!comments?.length && <p style={{ color: 'var(--muted)' }}>No comments yet.</p>}
        </div>
      </div>

      {createModal && (
        <div className={styles.modalBg} onClick={closeBranchForm}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Continuer la branche “{createModal.choiceLabel}”</h3>
              <button className={styles.closeBtn} onClick={closeBranchForm}>✕</button>
            </div>
            <div className={styles.formGrid}>
              <label className={styles.field}>
                Titre (optionnel)
                <input name="title" value={draftSegment.title} onChange={updateDraftField} placeholder="Nouveau segment..." />
              </label>
              <label className={styles.field}>
                Relier à un choix existant
                <select
                  value={branchChoiceId || ''}
                  onChange={(e) => setBranchChoiceId(e.target.value ? Number(e.target.value) : null)}
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
                <input name="image_url" value={draftSegment.image_url} onChange={updateDraftField} placeholder="https://..." />
              </label>
            </div>

            <div className={styles.choicesEditor}>
              <div className={styles.choiceEditorHeader}>
                <span>Choix suivants (optionnel)</span>
                <button type="button" className={styles.smallGhost} onClick={addDraftChoice}>+ Ajouter un choix</button>
              </div>
              {draftChoices.map((c, idx) => (
                <div key={idx} className={styles.choiceRow}>
                  <input
                    value={c}
                    onChange={(e) => updateDraftChoice(idx, e.target.value)}
                    placeholder={`Choix ${idx + 1}`}
                  />
                  {draftChoices.length > 1 && (
                    <button type="button" className={styles.smallGhost} onClick={() => removeDraftChoice(idx)}>Supprimer</button>
                  )}
                </div>
              ))}
            </div>

            <div className={styles.modalActions}>
              <button className="btn ghost" onClick={closeBranchForm} disabled={isSubmitting}>Annuler</button>
              <button className="btn primary" onClick={submitBranch} disabled={isSubmitting}>
                {isSubmitting ? 'Création...' : 'Créer et poursuivre'}
              </button>
            </div>
          </div>
        </div>
      )}

      {choiceModal && (
        <div className={styles.modalBg} onClick={() => setChoiceModal(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Choisir un segment</h3>
              <button className={styles.closeBtn} onClick={() => setChoiceModal(null)}>✕</button>
            </div>
            <p className={styles.choiceHint}>Segments disponibles pour “{choiceModal.choiceLabel || 'Choix'}”</p>
            <div className={styles.choiceList}>
              {choiceModal.segments?.map((seg) => (
                <button
                  key={seg.id}
                  className={styles.choice_button}
                  style={{ width: '100%', justifyContent: 'flex-start' }}
                  onClick={async () => {
                    setChoiceModal(null);
                    await loadSegment(seg.id);
                  }}
                  disabled={isLoading}
                >
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700 }}>{seg.title || `Segment #${seg.id}`}</div>
                    <div className={styles.choiceHint}>{(seg.content || '').slice(0, 120)}...</div>
                  </div>
                </button>
              ))}
            </div>
            {(!choiceModal.segments || !choiceModal.segments.length) && (
              <p style={{ color: 'var(--muted)' }}>Aucun segment pour ce choix.</p>
            )}
          </div>
        </div>
      )}

      {editModal && (
        <div className={styles.modalBg} onClick={() => setEditModal(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Modifier le segment</h3>
              <button className={styles.closeBtn} onClick={() => setEditModal(false)}>✕</button>
            </div>
            {editError && <div style={{ color: 'red' }}>{editError}</div>}
            {editSuccess && <div style={{ color: 'green' }}>{editSuccess}</div>}
            <div className={styles.formGrid}>
              <label className={styles.field}>
                Titre
                <input name="title" value={editSegment.title} onChange={updateEditField} placeholder="Titre..." />
              </label>
              <label className={`${styles.field} ${styles.full}`}>
                Contenu
                <textarea name="content" value={editSegment.content} onChange={updateEditField} rows={4} />
              </label>
              <label className={styles.field}>
                Image (URL)
                <input name="image_url" value={editSegment.image_url} onChange={updateEditField} placeholder="https://..." />
              </label>
              <label className={styles.field}>
                <span>Terminal ?</span>
                <input type="checkbox" name="is_terminal" checked={editSegment.is_terminal} onChange={updateEditField} />
              </label>
            </div>

            <div className={styles.choicesEditor}>
              <div className={styles.choiceEditorHeader}>
                <span>Choix</span>
                <button type="button" className={styles.smallGhost} onClick={addEditChoice}>+ Ajouter</button>
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
                    <button type="button" className={styles.smallGhost} onClick={() => removeEditChoice(idx)}>Supprimer</button>
                  )}
                </div>
              ))}
              {!editChoices.length && <span className={styles.choiceHint}>Aucun choix pour l’instant.</span>}
            </div>

            <div className={styles.modalActions}>
              <button type="button" className="btn ghost" onClick={() => setEditModal(false)} disabled={isSubmitting}>Annuler</button>
              <button type="button" className="btn primary" onClick={submitEdit} disabled={isSubmitting}>
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReadStory;

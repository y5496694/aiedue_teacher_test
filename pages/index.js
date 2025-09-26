import { useMemo, useState } from 'react';
import Head from 'next/head';

const CATEGORIES = ['계획서/표', '가정통신문', '커뮤니티'];

const RESOURCE_DATA = {
  '계획서/표': [
    { id: 1, title: '1학기 학급 운영 계획서', description: '학급 운영 목표와 활동 계획을 정리한 문서입니다.' },
    { id: 2, title: '월별 수업 계획표', description: '월별 주제 및 학습 목표를 정리한 표입니다.' },
    { id: 3, title: '학부모 상담 일정표', description: '학부모 상담 일정을 정리하여 공유합니다.' },
    { id: 4, title: '프로젝트 학습 시나리오', description: '학생 주도 프로젝트 진행을 위한 시나리오입니다.' },
    { id: 5, title: '체험학습 일정 및 준비물', description: '체험학습 일정과 준비물을 정리한 안내문입니다.' },
    { id: 6, title: '학급 행사 계획표', description: '한 해 동안의 학급 행사 계획을 정리했습니다.' },
    { id: 7, title: '주간 수업안 템플릿', description: '주간 수업안을 작성하기 위한 템플릿입니다.' },
    { id: 8, title: '프로그램 운영 체크리스트', description: '수업 프로그램 운영 시 확인해야 할 항목들입니다.' },
  ],
  '가정통신문': [
    { id: 1, title: '4월 가정통신문', description: '4월 학사 일정과 안내 사항을 담았습니다.' },
    { id: 2, title: '독서 활동 안내', description: '가정에서 진행 가능한 독서 활동을 안내합니다.' },
    { id: 3, title: '학부모 상담 안내', description: '상담 일정과 신청 방법을 안내합니다.' },
    { id: 4, title: '방학 생활 계획표', description: '방학 중 학생 생활을 위한 계획표입니다.' },
    { id: 5, title: '안전 교육 안내', description: '학교 안전 교육과 협조 사항을 안내합니다.' },
    { id: 6, title: '수학여행 안내', description: '수학여행 일정과 준비 사항을 안내합니다.' },
    { id: 7, title: '온라인 학습 가이드', description: '온라인 학습 이용 가이드를 담았습니다.' },
    { id: 8, title: '학부모 연수 안내', description: '학부모 대상 연수 프로그램 안내문입니다.' },
  ],
};

let postSequence = 3;
let commentSequence = 5;

const INITIAL_POSTS = [
  {
    id: 1,
    title: '학급 행사 아이디어 공유해요',
    content:
      '이번 학급 행사에서 학생들이 주도할 수 있는 활동 아이디어를 찾고 있어요. 함께 나눠요!',
    author: '김교사',
    createdAt: new Date('2024-06-01T09:30:00'),
    comments: [
      { id: 1, author: '박교사', text: '학생들이 직접 준비하는 플리마켓은 어떨까요?', createdAt: new Date('2024-06-01T10:15:00') },
      { id: 2, author: '김교사', text: '좋은 아이디어 감사합니다! 준비물 체크리스트를 만들어볼게요.', createdAt: new Date('2024-06-01T12:00:00') },
    ],
  },
  {
    id: 2,
    title: '온라인 수업 자료 공유합니다',
    content: '원격 수업에서 사용했던 활동지와 영상 링크를 정리했습니다. 참고해 주세요!',
    author: '이교사',
    createdAt: new Date('2024-05-27T08:00:00'),
    comments: [
      { id: 3, author: '정교사', text: '자료 감사해요! 다른 교실에서도 잘 활용할 수 있을 것 같아요.', createdAt: new Date('2024-05-27T09:20:00') },
      { id: 4, author: '이교사', text: '필요하시면 활동지 편집본도 공유 드릴게요.', createdAt: new Date('2024-05-27T11:05:00') },
    ],
  },
  {
    id: 3,
    title: '새학기 학부모 안내문 작성 팁',
    content: '학부모님들께 전달할 안내문 작성 시 체크하면 좋은 내용을 정리했어요.',
    author: '최교사',
    createdAt: new Date('2024-05-20T14:10:00'),
    comments: [
      { id: 5, author: '손교사', text: '신입 학부모님들에게 큰 도움이 될 것 같습니다!', createdAt: new Date('2024-05-20T15:00:00') },
    ],
  },
];

function formatDate(value) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value);
}

export default function Home() {
  const [userName, setUserName] = useState('홍길동');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postForm, setPostForm] = useState({ title: '', content: '' });
  const [postMenuOpenId, setPostMenuOpenId] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [commentDrafts, setCommentDrafts] = useState({});
  const [editingComment, setEditingComment] = useState(null);

  const resources = useMemo(() => RESOURCE_DATA, []);

  const handleOpenProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  const handleProfileSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') || '').trim();
    if (name) {
      setUserName(name);
    }
    handleCloseProfileModal();
  };

  const handlePostModalToggle = () => {
    setIsPostModalOpen((prev) => !prev);
    setPostForm({ title: '', content: '' });
    setEditingPostId(null);
  };

  const handlePostFormChange = (event) => {
    const { name, value } = event.target;
    setPostForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreatePost = (event) => {
    event.preventDefault();
    const title = postForm.title.trim();
    const content = postForm.content.trim();

    if (!title || !content) {
      return;
    }

    postSequence += 1;
    const newPost = {
      id: postSequence,
      title,
      content,
      author: userName,
      createdAt: new Date(),
      comments: [],
    };

    setPosts((prev) => [newPost, ...prev]);
    handlePostModalToggle();
  };

  const handlePostMenuToggle = (postId) => {
    setPostMenuOpenId((prev) => (prev === postId ? null : postId));
  };

  const handleEditPostTitle = (postId) => {
    const post = posts.find((item) => item.id === postId);
    if (!post || post.author !== userName) {
      return;
    }
    setEditingPostId(postId);
    setPostForm({ title: post.title, content: post.content });
    setIsPostModalOpen(true);
  };

  const handleUpdatePostTitle = (event) => {
    event.preventDefault();
    if (!editingPostId) {
      return;
    }
    const title = postForm.title.trim();
    if (!title) {
      return;
    }

    setPosts((prev) =>
      prev.map((post) =>
        post.id === editingPostId
          ? {
              ...post,
              title,
            }
          : post,
      ),
    );
    setEditingPostId(null);
    setIsPostModalOpen(false);
  };

  const handleDeletePost = (postId) => {
    const post = posts.find((item) => item.id === postId);
    if (!post || post.author !== userName) {
      return;
    }
    setPosts((prev) => prev.filter((item) => item.id !== postId));
    setPostMenuOpenId(null);
  };

  const handleCommentDraftChange = (postId, value) => {
    setCommentDrafts((prev) => ({ ...prev, [postId]: value }));
  };

  const handleCreateComment = (event, postId) => {
    event.preventDefault();
    const draft = (commentDrafts[postId] || '').trim();
    if (!draft) {
      return;
    }
    commentSequence += 1;
    const newComment = {
      id: commentSequence,
      author: userName,
      text: draft,
      createdAt: new Date(),
    };
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post,
      ),
    );
    setCommentDrafts((prev) => ({ ...prev, [postId]: '' }));
  };

  const handleStartEditComment = (postId, commentId, currentText) => {
    setEditingComment({ postId, commentId });
    setCommentDrafts((prev) => ({ ...prev, [`${postId}-${commentId}`]: currentText }));
  };

  const handleCommentEditChange = (postId, commentId, value) => {
    setCommentDrafts((prev) => ({ ...prev, [`${postId}-${commentId}`]: value }));
  };

  const handleUpdateComment = (event, postId, commentId) => {
    event.preventDefault();
    const key = `${postId}-${commentId}`;
    const draft = (commentDrafts[key] || '').trim();
    if (!draft) {
      return;
    }
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment.id === commentId ? { ...comment, text: draft } : comment,
              ),
            }
          : post,
      ),
    );
    setEditingComment(null);
    setCommentDrafts((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  const handleDeleteComment = (postId, commentId) => {
    const post = posts.find((item) => item.id === postId);
    if (!post) {
      return;
    }
    const comment = post.comments.find((item) => item.id === commentId);
    if (!comment || comment.author !== userName) {
      return;
    }
    setPosts((prev) =>
      prev.map((item) =>
        item.id === postId
          ? { ...item, comments: item.comments.filter((commentItem) => commentItem.id !== commentId) }
          : item,
      ),
    );
  };

  const handlePostModalSubmit = editingPostId ? handleUpdatePostTitle : handleCreatePost;

  return (
    <>
      <Head>
        <title>Aiedu Plan</title>
      </Head>
      <main className="page">
        <header className="header">
          <div className="header__title">
            <h1>홈</h1>
            <p className="header__subtitle">필요한 자료와 커뮤니티 소식을 한눈에 확인하세요.</p>
          </div>
          <div className="header__actions">
            <button type="button" className="header__button" onClick={handleOpenProfileModal}>
              내 정보
            </button>
            <button type="button" className="header__button header__button--secondary">
              로그아웃
            </button>
          </div>
        </header>

        <section className="categories">
          <div className="categories__tabs">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                className={`categories__tab ${activeCategory === category ? 'is-active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {activeCategory !== '커뮤니티' ? (
            <div className="resource-grid">
              {resources[activeCategory]?.map((resource) => (
                <article key={resource.id} className="resource-card">
                  <h3 className="resource-card__title">{resource.title}</h3>
                  <p className="resource-card__description">{resource.description}</p>
                  <button type="button" className="resource-card__button">
                    자세히 보기
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="community">
              <div className="community__header">
                <h2>커뮤니티</h2>
                <button type="button" className="community__create" onClick={handlePostModalToggle}>
                  글 작성
                </button>
              </div>
              <div className="community__list">
                {posts.map((post) => {
                  const isOwner = post.author === userName;
                  return (
                    <article key={post.id} className="community-card">
                      <header className="community-card__header">
                        <div>
                          <h3 className="community-card__title">{post.title}</h3>
                          <p className="community-card__meta">
                            작성자 {post.author}
                          </p>
                        </div>
                        <div className="community-card__actions">
                          <span className="community-card__date">{formatDate(post.createdAt)}</span>
                          {isOwner && (
                            <div className="post-menu">
                              <button
                                type="button"
                                className="post-menu__trigger"
                                onClick={() => handlePostMenuToggle(post.id)}
                              >
                                ⋮
                              </button>
                              {postMenuOpenId === post.id && (
                                <div className="post-menu__content">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handlePostMenuToggle(post.id);
                                      handleEditPostTitle(post.id);
                                    }}
                                  >
                                    제목 편집
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleDeletePost(post.id);
                                    }}
                                  >
                                    삭제
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </header>
                      <p className="community-card__content">{post.content}</p>
                      <section className="comments">
                        <h4 className="comments__title">댓글</h4>
                        <ul className="comments__list">
                          {post.comments.map((comment) => {
                            const commentKey = `${post.id}-${comment.id}`;
                            const isCommentOwner = comment.author === userName;
                            const isEditing =
                              editingComment?.postId === post.id && editingComment?.commentId === comment.id;

                            return (
                              <li key={comment.id} className="comments__item">
                                <div className="comments__header">
                                  <span className="comments__author">{comment.author}</span>
                                  <span className="comments__date">{formatDate(comment.createdAt)}</span>
                                </div>
                                {isEditing ? (
                                  <form
                                    className="comments__edit-form"
                                    onSubmit={(event) => handleUpdateComment(event, post.id, comment.id)}
                                  >
                                    <textarea
                                      value={commentDrafts[commentKey] || ''}
                                      onChange={(event) =>
                                        handleCommentEditChange(post.id, comment.id, event.target.value)
                                      }
                                      rows={2}
                                      required
                                    />
                                    <div className="comments__buttons">
                                      <button type="submit" className="comments__button">
                                        저장
                                      </button>
                                      <button
                                        type="button"
                                        className="comments__button comments__button--secondary"
                                        onClick={() => {
                                          setEditingComment(null);
                                          setCommentDrafts((prev) => {
                                            const updated = { ...prev };
                                            delete updated[commentKey];
                                            return updated;
                                          });
                                        }}
                                      >
                                        취소
                                      </button>
                                    </div>
                                  </form>
                                ) : (
                                  <p className="comments__text">{comment.text}</p>
                                )}
                                {isCommentOwner && !isEditing && (
                                  <div className="comments__controls">
                                    <button
                                      type="button"
                                      onClick={() => handleStartEditComment(post.id, comment.id, comment.text)}
                                    >
                                      수정
                                    </button>
                                    <button type="button" onClick={() => handleDeleteComment(post.id, comment.id)}>
                                      삭제
                                    </button>
                                  </div>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                        <form className="comments__form" onSubmit={(event) => handleCreateComment(event, post.id)}>
                          <textarea
                            placeholder="댓글을 입력하세요"
                            value={commentDrafts[post.id] || ''}
                            onChange={(event) => handleCommentDraftChange(post.id, event.target.value)}
                            rows={2}
                          />
                          <button type="submit" className="comments__button">
                            댓글 등록
                          </button>
                        </form>
                      </section>
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </main>

      {isProfileModalOpen && (
        <div className="modal">
          <div className="modal__content">
            <h2 className="modal__title">내 정보</h2>
            <form className="modal__form" onSubmit={handleProfileSubmit}>
              <label className="modal__label" htmlFor="name">
                이름
              </label>
              <input id="name" name="name" type="text" defaultValue={userName} required />
              <div className="modal__actions">
                <button type="submit" className="modal__button">
                  저장
                </button>
                <button type="button" className="modal__button modal__button--secondary" onClick={handleCloseProfileModal}>
                  닫기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isPostModalOpen && (
        <div className="modal">
          <div className="modal__content">
            <h2 className="modal__title">{editingPostId ? '제목 편집' : '글 작성'}</h2>
            <form className="modal__form" onSubmit={handlePostModalSubmit}>
              <label className="modal__label" htmlFor="post-title">
                제목
              </label>
              <input
                id="post-title"
                name="title"
                type="text"
                value={postForm.title}
                onChange={handlePostFormChange}
                required
              />
              {!editingPostId && (
                <>
                  <label className="modal__label" htmlFor="post-content">
                    내용
                  </label>
                  <textarea
                    id="post-content"
                    name="content"
                    value={postForm.content}
                    onChange={handlePostFormChange}
                    rows={5}
                    required
                  />
                </>
              )}
              <div className="modal__actions">
                <button type="submit" className="modal__button">
                  {editingPostId ? '저장' : '등록'}
                </button>
                <button
                  type="button"
                  className="modal__button modal__button--secondary"
                  onClick={handlePostModalToggle}
                >
                  닫기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        :global(body) {
          margin: 0;
          font-family: 'Noto Sans KR', sans-serif;
          background-color: #f5f7fa;
          color: #222;
        }

        .page {
          min-height: 100vh;
          padding: 2.5rem;
          box-sizing: border-box;
        }

        .header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 2rem;
        }

        .header__title h1 {
          margin: 0;
          font-size: 2rem;
        }

        .header__subtitle {
          margin: 0.5rem 0 0;
          color: #5f6c7b;
        }

        .header__actions {
          display: flex;
          gap: 0.75rem;
        }

        .header__button {
          padding: 0.6rem 1.1rem;
          border-radius: 0.5rem;
          border: 1px solid #366ae2;
          background-color: #366ae2;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .header__button--secondary {
          background-color: #fff;
          color: #366ae2;
        }

        .header__button:hover {
          background-color: #274cb3;
          color: #fff;
        }

        .header__button--secondary:hover {
          background-color: #e7edff;
        }

        .categories {
          background-color: #fff;
          border-radius: 1.25rem;
          padding: 2rem;
          box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);
        }

        .categories__tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .categories__tab {
          padding: 0.75rem 1.5rem;
          border-radius: 999px;
          border: 1px solid #d4dbe8;
          background-color: #f4f6fb;
          font-weight: 600;
          color: #5f6c7b;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .categories__tab.is-active {
          background-color: #366ae2;
          border-color: #366ae2;
          color: #fff;
        }

        .categories__tab:hover {
          border-color: #a1b5f4;
          color: #274cb3;
        }

        .resource-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1.5rem;
        }

        .resource-card {
          background-color: #f8faff;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: inset 0 0 0 1px #e0e7ff;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .resource-card__title {
          margin: 0;
          font-size: 1rem;
          font-weight: 700;
          color: #1d2b4f;
        }

        .resource-card__description {
          margin: 0;
          color: #5f6c7b;
        }

        .resource-card__button {
          align-self: flex-start;
          margin-top: auto;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          border: 1px solid #366ae2;
          background-color: #366ae2;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
        }

        .community {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .community__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .community__create {
          padding: 0.6rem 1.2rem;
          border-radius: 0.75rem;
          border: none;
          background-color: #366ae2;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
        }

        .community__list {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1.5rem;
        }

        .community-card {
          background-color: #f8faff;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: inset 0 0 0 1px #e0e7ff;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .community-card__header {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
        }

        .community-card__title {
          margin: 0 0 0.25rem;
          font-size: 1.05rem;
          color: #1d2b4f;
        }

        .community-card__meta {
          margin: 0;
          color: #5f6c7b;
          font-size: 0.9rem;
        }

        .community-card__actions {
          display: flex;
          align-items: flex-start;
          gap: 0.4rem;
        }

        .community-card__date {
          color: #5f6c7b;
          font-size: 0.85rem;
          white-space: nowrap;
        }

        .post-menu {
          position: relative;
        }

        .post-menu__trigger {
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 1.25rem;
          line-height: 1;
          padding: 0 0.25rem;
          color: #5f6c7b;
        }

        .post-menu__content {
          position: absolute;
          top: 1.5rem;
          right: 0;
          background-color: #fff;
          border-radius: 0.5rem;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.15);
          display: flex;
          flex-direction: column;
          min-width: 7rem;
          overflow: hidden;
        }

        .post-menu__content button {
          border: none;
          background: none;
          padding: 0.75rem 1rem;
          text-align: left;
          font-size: 0.95rem;
          cursor: pointer;
        }

        .post-menu__content button:hover {
          background-color: #f1f5ff;
        }

        .community-card__content {
          margin: 0;
          color: #33415c;
          line-height: 1.5;
        }

        .comments {
          background-color: #fff;
          border-radius: 0.75rem;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          box-shadow: inset 0 0 0 1px #e5ebff;
        }

        .comments__title {
          margin: 0;
          font-size: 1rem;
          color: #1d2b4f;
        }

        .comments__list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .comments__item {
          background-color: #f6f8ff;
          border-radius: 0.75rem;
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .comments__header {
          display: flex;
          justify-content: space-between;
          color: #5f6c7b;
          font-size: 0.85rem;
        }

        .comments__text {
          margin: 0;
          color: #33415c;
          line-height: 1.5;
        }

        .comments__controls {
          display: flex;
          gap: 0.5rem;
        }

        .comments__controls button {
          border: none;
          background: none;
          color: #366ae2;
          font-weight: 600;
          cursor: pointer;
        }

        .comments__form,
        .comments__edit-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .comments__form textarea,
        .comments__edit-form textarea {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid #d4dbe8;
          padding: 0.65rem;
          resize: vertical;
          font-family: inherit;
        }

        .comments__buttons {
          display: flex;
          gap: 0.5rem;
        }

        .comments__button {
          align-self: flex-start;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          border: none;
          background-color: #366ae2;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
        }

        .comments__button--secondary {
          background-color: #e5ebff;
          color: #274cb3;
        }

        .modal {
          position: fixed;
          inset: 0;
          background-color: rgba(15, 23, 42, 0.45);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1.5rem;
          z-index: 10;
        }

        .modal__content {
          background-color: #fff;
          border-radius: 1rem;
          padding: 2rem;
          width: min(28rem, 100%);
          box-shadow: 0 25px 45px rgba(15, 23, 42, 0.2);
        }

        .modal__title {
          margin: 0 0 1.5rem;
          font-size: 1.3rem;
          color: #1d2b4f;
        }

        .modal__form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .modal__label {
          font-weight: 600;
          color: #33415c;
        }

        .modal__form input,
        .modal__form textarea {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid #d4dbe8;
          padding: 0.75rem;
          font-size: 1rem;
          font-family: inherit;
        }

        .modal__actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
        }

        .modal__button {
          padding: 0.6rem 1.2rem;
          border-radius: 0.5rem;
          border: none;
          background-color: #366ae2;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
        }

        .modal__button--secondary {
          background-color: #e5ebff;
          color: #274cb3;
        }

        @media (max-width: 1200px) {
          .resource-grid,
          .community__list {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 960px) {
          .header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .resource-grid,
          .community__list {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .page {
            padding: 1.5rem;
          }

          .resource-grid,
          .community__list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}

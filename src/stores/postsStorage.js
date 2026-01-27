const POSTS_KEY = "fweng_posts"; 

export function getPosts() {
  try {
    const raw = localStorage.getItem(POSTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePosts(posts) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

export function addPost(newPost) {
  const posts = getPosts();
  posts.unshift(newPost); // neueste oben
  savePosts(posts);
  return posts;
}

export function clearPosts() {
  localStorage.removeItem(POSTS_KEY);
}

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

// Alternative dynamic URL construction
const API_BASE_URL = 'http://' + window.location.hostname + ':5000';

function ArticleForm() {
const [title, setTitle] = useState('');
const [content, setContent] = useState('');
const navigate = useNavigate();
const { id } = useParams();

useEffect(() => {
if (id) {
axios.get(API_BASE_URL + '/api/articles/' + id)
.then((res) => {
setTitle(res.data.title);
setContent(res.data.content);
})
.catch((err) => {
console.error(err);
});
}
}, [id]);

const handleSubmit = async (e) => {
e.preventDefault();
try {
if (id) {
await axios.put(API_BASE_URL + '/api/articles/' + id, { title, content });
} else {
await axios.post(API_BASE_URL + '/api/articles', { title, content });
}
navigate('/');
} catch (err) {
console.error(err);
}
};

return (
<div>
<h2>{id ? 'Edit' : 'New'} Article</h2>
<form onSubmit={handleSubmit}>
<div>
<label>Title:</label>
<br />
<input
type="text"
value={title}
onChange={(e) => setTitle(e.target.value)}
required
style={{ width: '100%' }}
/>
</div>
<div>
<label>Content:</label>
<br />
<textarea
value={content}
onChange={(e) => setContent(e.target.value)}
required
rows={10}
style={{ width: '100%' }}
/>
</div>
<button type="submit">{id ? 'Update' : 'Create'}</button>
</form>
</div>
);
}

export default ArticleForm;
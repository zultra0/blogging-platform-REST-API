# Blogging Platform REST API 
## Using the REST API
### API endpoints
### `GET`
- `/posts/:id`: Fetch a single post by its `id`
- `/posts?term={term}`: Fetch all posts
  - Query Parameters
    - `term` (optional): This filters posts by 'title', 'content', 'category' or 'tags'
### `POST`
- `/posts`: Create a new post
  - Body:
    - `title: String` (required): The title of the post
    - `content: String` (required): The content of the post
    - `category: String` (required): The category of the post
    - `tags: ["String"]` (optional): The tags of the post   

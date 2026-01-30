export const ApiConfig = {
  BASE_URL_TAMKEEN: "https://tamkeen-dev.com/api",
  ENDPOINTS: {
    // ✅ Auth
    REGISTER: "/user/registerpass?_format=json",
    LOGIN: "/user/login?_format=json",
    USER: "/user",
    SESSION_TOKEN: "/session/token",

    // ✅ Existing endpoints
    TERMS_CATEGORY: "/terms/category",
    TERMS_TAGS: "/terms/tags",


    USERS_LIST: "/users-list",

    

    CREATE_BLOG_NODE: "/node?_format=json",
    UPLOAD_BLOG_BANNER: "/file/upload/node/blog/field_image?_format=json",
    UPLOAD_BLOG_GALLERY: "/file/upload/node/blog/field_gallery?_format=json",

    UPLOAD_USER_PICTURE: "/file/upload/user/user/user_picture?_format=json",

    // ✅ my articles
    MY_ARTICLES_CURRENT_USER: "/blogs-api-current-user",

    // ✅ base node endpoint (للتعديل والحذف)
    NODE: "/node",
  },
};

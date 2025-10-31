# The following requirements need to be implemented:

## Guide

- Guide is a entity that handles learning information about topic
- Guide needs, title, description, topics, authorIds, status (DRAFT, PUBLISHED, ARCHIVED, DELETED, ASSOCIATED_WITH_COURSE), createdAt, updatedAt, likes, pages, coverImage.
- A coverImage is just a url for image
- A topic is a entity that handles learning information about a specific subject. It is used to organize guides into categories, search, and filter guides. So Guide can have multiple topics Ids.
- A topic needs topicId, name.
- A like is a entity that handles user interaction with guides. When a user likes a guide, it increments the likes count and stores the user's ID in a separate table. When a guide is asked for, it retrieves the likes count and if the user who makes the request has liked the guide as a boolean value.
- A page is a entity that handles content (markdown), order (numeric value), and guideId. So that Guide can have multiple pages ordered.
- A guide can have multiple authors.

## Course

-A Course is a complex entity, it has many guides. in fact, its the same Guide entity. But it does not means that a Guide knows about the course it belongs. The way to know is through the status ASSOCIATED_WITH_COURSE, this means that a Guide is not visible to the user. it is only visible for enrolled users with this course.
- A Course needs, title, description, coverImage, topics (the same as guides has), authorsIds (the same as guides has), createdAt, updatedAt, status (DRAFT, PUBLISHED, ARCHIVED, DELETED), likes

## Enrollements
- A user can enroll in a course.
- A user can unenroll from a course.

## Comments

- course and guide has a comments section.
- it has sub comments, replies, NO LIKES
- likes are only for guides and course.

## Endpoints
- System has the following roles: 'ROLE_ADMIN', 'ROLE_STUDENT', 'ROLE_TEACHER'
- So when user queries all available guides then only guides with status PUBLISHED are returned. this endpoint is called /guides.

- when user queries a course then retrieves all course data, and its guides are mapped to retrieve only, its guideId, title, coverImage, topics (full data), likes (count and if user liked it as boolean). this endpoint is called /courses/{courseId} GET, this only happend when the user is enrolled in the course. otherwise only returns course data with an empty array of guides.

- when user enters to a course guide then retrieves all guide data. with this endpoint /courses/{courseId}/guides/{guideId} GET

- to create a new course, user must be authenticated and have the role 'ROLE_ADMIN' or 'ROLE_TEACHER' and needs to provide course title, description, coverImage, topicsIds, authorsIds (by default, the user itself). with this endpoint /courses POST

- to create a new guide, user must be authenticated and have the role 'ROLE_ADMIN' or 'ROLE_TEACHER' and needs to provide guide title, description, coverImage, topicsIds, authorsIds (by default, the user itself). with this endpoint /guides POST

- to enroll in a course, user must be authenticated, in this endpoint its no need role validation. and needs to provide courseId. with this endpoint /courses/{courseId}/enrollments POST

- to unenroll from a course, user must be authenticated, in this endpoint its no need role validation. and needs to provide courseId. with this endpoint /courses/{courseId}/enrollments DELETE

- every entity needs a search endpoint. guide and course can be searched by title, topics, authors. with this endpoint /courses/search GET and /guides/search GET every field can be optional or null. these endpoints have pagination and sorting options. and applies all validation above.

- every entity needs a update endpoint. based on its core data, guide can be updated with title, description, coverImage, status. with this endpoint /guides/{guideId} PUT if authors needs to be updated then follow this endpoint /guides/{guideId}/authors PUT where body is {authors: string[]}. the same logic applies to course update endpoint /courses/{courseId} PUT if authors needs to be updated then follow this endpoint /courses/{courseId}/authors PUT where body is {authors: string[]}.

- courses and guides needs a delete endpoint. with this endpoint /courses/{courseId} DELETE and /guides/{guideId} DELETE
- courses and guides needs  a likes endpoints /courses/{courseId}/likes POST and /guides/{guideId}/likes POST

-

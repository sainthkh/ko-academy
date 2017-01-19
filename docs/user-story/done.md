# user
* As a user, I want to sign up the waiting list because I want to know when WA starts and get the practice sheets I needed.

# development tools
* As a developer, I want to generate production code with a single command input because it's tedious job.
* As a developer, I want to compile only changed code. 

# Admin Page
* As an admin, I want to login to admin site with an ID and a password. 

# email
* As an admin, I want to send my new practice sheets by email. 
 * I want to compose my email in admin UI because it's intuitive and easy.
 * To follow the law(CANSPAM), I have to show the address and physical address.
 * Users should be added to default email list when they signed up the form. 

# Sign up/Log in
* As a user, I can sign up the site by providing username, email, password so that I can access free contents and more.
 * As a system, I will check email duplicity, <50-length username, >10-length password. 
 * As a system, I will show password strength to the user. 
* As a user, I can log in to the site by email and password. 
* As a user, I can log out by clicking the logout button. 

# Table of Contents Page
* As a user, I can move on to my next lecture. 
* As an admin, I can organize the lectures. 
* As an admin, I can decide basic information of the course like course name, description, etc. 
* As an admin, I want to edit course TOC so that it will attract users. 

# Lecture Page
* As a guest, I can watch the lecture video.
 * As a system, I'll show them the sign up message. 
* As a user, I can download the script & other resources. 
 * As a system, I'll show guests signup popup when they click the download link. 
* As a guest, I can click to move on to the next lecture. 
* As an admin, I can set up basic information like lecture name, video, downloads, scripts, course name, lecture slug, etc. 
* As an admin, I can edit basic information.
* As an admin, I want to edit lecture content so that I can teach them Korean. 
 
# Quiz
## Quiz Access
* As a free or gold user, I can solve quizzes.
 * As a system, I'll show them correct or wrong messages according to their choices. 
 * As a system, I'll show them the result when they finish the quiz. 
 * As a system, I'll only allow free users to free quizzes. 
  * As a system, I'll show them signup message when they finish the quiz.
  * As a system, I'll redirect them to the payment page when they try to access gold quiz.

## Quiz Types
* As a user, I can choose a single answer from text choices. 

## Lecture Quiz
* As a user, I can see hints when I chose the wrong answers. 
* As a user, I can see the explanation at the end of the question.
* As a user, I can see the result at the end of the quiz. 

# Quiz Log 
* As a system, I'll log their quiz results, the answer they chose, question ID, the date, etc. 

# Payment
* As a user, I can signup gold plan with my credit card. 
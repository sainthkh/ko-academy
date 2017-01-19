# Email
* As an admin, I can send an email to a set of users that meet certain condition. 
 * These conditions: sign up the academy site, sign up email list, finish lectures, buy books, finish survey, etc. 
 * These emails will be review resource, good-job/compliment, survey, etc.
 * As a system, I can send email to users when they finish a task. 
* As an admin, I can set up an email that will be sent to users who haven't logged in for last 30 days. 
 * As a system, I will send email email to users when they haven't logged in for 30 days. 

# Log
* As a system, I can log users when they finish a task so that I can use them for gamification and segmentation. 
* Log lists. 
 * As a system, I will record email, list, time when they sign up a list. 

# Sign up/Log in
* As a system, I will send welcome email to the user when the sign up is succeeded. 
* As a user, I can find my password by the email.
 * As a system, I will send "find password" email to the user with a link to the new password page. 
  * As a system, I will check the validness of the link to prevent hacking. This link will be valid for only 10 minutes. 
* As a user, I can log out by clicking the logout button. 

# Table of Contents Page
* As a user, I can buy or download the ebook of the course.
* As a user, I can buy the paperback of the course. 
* As an admin, I can set up course that will open lectures to each user according to their acheivements. 
* As and admin, I can decide basic information of the course like product info, etc. 

# Courses Page
* As a user, I can choose my course from courses page. 
 * As a system, I will show them the title and summary. 

# My Page
* As a user, I can download ebooks I bought. 
* As a user, I can access quiz review page. 
* As a user, I can see my badges, points, leaderboard. 

# Payment
* As a user, I can cancel my subscription by clicking unsubscribe button on my page. 

# Quiz
## Quiz Types
* As a user, I can choose a single or multiple answers from text choices. 
* As a user, I can choose a single or multiple answers from picture choices. 
* As a user, I can match choices by drawing lines. 
 * Develop Note: Use <canvas> tag.
* As a user, I can drag and drop answers to blanks. 
* As a user, I can type down my answers.

## Quiz Content
* As an admin, I can use html elements like video, audio, images, various tags in the quiz. 

## Review System
* As a user, I can review the questions I have solved. 
 * As a system, I will show them the wrong questions more frequently than correct questions. 
 * As a system, I will calculate when they will see the question again. The term will become longer when they chose the correct answer. 

# Access Level
*              Guest Gold Platinum Admin
  Main           o    o      o       o
  Course TOC     o    o      o       o
  Lecture        *    o      o       o
  Quiz           x    *      o       o
  Critique       x    x      *       o
  *-> partial access
* Name of level next to Platinum is Diamond

# Others
* Q & A
* Critique
* Writing practice
* Native App
* Gamification
* Facebook Style page. - Show, brag, share the results
* Wall of Fame. - Showing Achievements. 
* Theming
* Hosting Service
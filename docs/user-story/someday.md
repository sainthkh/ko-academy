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
* As a user, I can sign up the site by providing username, email, password so that I can access free contents and more.
 * As a system, I will check email duplicity, <50-length username, >10-length password. 
 * As a system, I will show password strength to the user. 
 * As a system, I will send welcom email to the user when the sign up is succeeded. 
* As a user, I can log in to the site by email and password. 
* As a user, I can find my password by the email.
 * As a system, I will send "find password" email to the user with a link to the new password page. 
  * As a system, I will check the validness of the link to prevent hacking. This link will be valid for only 10 minutes. 
* As a user, I can log out by clicking the logout button. 

# Table of Contents Page
* As a user, I can move on to my next lecture. 
* As a user, I can buy or download the ebook of the course.
* As a user, I can buy the paperback of the course. 
* As an admin, I can set up course that will open lectures to each user according to their acheivements. 
* As an admin, I can organize the lectures. 
* As and admin, I can decide basic information of the course like course name, description, product info, etc. 

# Lecture Page
* As a guest, I can watch the lecture video.
 * As a system, I'll show them the sign up message. 
* As a user, I can download the script & other resources. 
 * As a system, I'll show guests signup popup when they click the download link. 
* As a guest, I can click to move on to the next lecture. 
* As an admin, I can set up basic information like lecture name, video, downloads, scripts, course name, lecture slug, etc. 
* As an admin, I can edit basic information. 

# Others
* Admin Page
 * As an admin, I want to edit course TOC so that it will attract users. 
 * As an admin, I want to edit lecture content so that I can teach them Korean.
* Quiz
* Quiz Log 
* Access Level
 *              Guest Gold Platinum Admin
   Main           o    o      o       o
   Course TOC     o    o      o       o
   Lecture        *    o      o       o
   Quiz           x    *      o       o
   Critique       x    x      *       o
   *-> partial access
 * Name of level next to Platinum is Diamond
* Payment
* Q & A
* Critique
* Writing practice
* Native App
* Gamification
* My Page
* Theming
* Hosting Service
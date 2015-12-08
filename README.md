
This is a WordPress plugin which makes simple little quizzes. It works by giving each answer a point value and then sums them up to give a result based on the score.

It makes a custom post type, mjj_quiz, which appears in admin as "Quizzes". For each questions, give some answers and the point value for each answer. (You might need to change the styles depending on how many answers per question you have.) Then put in the ranges and info for the results. You'll need to do it like 0-99, 100-199 -- ie, don't include the same number twice. You can use Markdown in the "more information" box for each result too. But no html tags. Those will be stripped out.

Then take the quiz!

##requirements

- [CMB2 plugin from WebDevStudios](https://github.com/WebDevStudios/CMB2) to make metaboxes
- I am not sure which version of WP is supported, but it was developed on a 4.4 beta. 
- The [WP REST API plugin](https://wordpress.org/plugins/rest-api/).  


##caveats and disclaimers

This is a work in progress and mainly a shell for something later. It's untested and I'm sure will change once I do that! Use at your own peril.


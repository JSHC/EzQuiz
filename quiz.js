/// <reference types="jquery" />
let questions = questionData;

$(document).ready(function(){
    let currQuestion = 0;
    //Questions array
    
   /* let questions = [
        {question : "How many oscars did the movie 'Titanic' get?", choices : ["11", "9", "13", "7"], correctAnswer : 0},
        {question : "In computing what is RAM short for?", choices : ["Random Alert Memory", "Read Access Memory", "Read Alert Magnet", "Random Access Memory"], correctAnswer : 3},
        {question : "Written by Neil Diamond, which song was UB40s first No. 1 UK hit?", choices : ["Red Red Wine", "Kingston Town", "(I Can't Help) Falling in Love With You", "I Got You Babe"], correctAnswer: 0}
    ]; */
    let answers = [];

    //Function for displaying questions. Takes the current question and current answer (if there is one) as arguments
    function displayQuestion(question, currAnswer){
        
        //Insert question text before the list of buttons
        $('#questionBox h2').text(question.question);
        
        //For each question, add a button to the list
        question.choices.forEach(function(element, index) {
            //If the question has an answer, make this radio-button checked
            if(typeof currAnswer !== 'undefined' && index == currAnswer){
                $('#questionList').append('<li><input type="radio" id="choice'+index+'" value="'+index+'" name="question'+currQuestion+'" checked="checked">'+element+'</li>');
            }
            else{
                $('#questionList').append('<li><input type="radio" id="choice'+index+'" value="'+index+'" name="question'+currQuestion+'">'+element+'</li>');
            }
           
        });
        
        //$('#questionBox').fadeIn();
        $('#questionBox').find('h2, #questionList', 'li', '.button').fadeIn();

        //Show back button if it isn't the first question
        if(currQuestion > 0){
            $('#backButton').show();
        }
        else{
            $('#backButton').hide();
        }

        //Change text of 'next' button to 'view result' if it's the last question
        if(typeof questions[currQuestion+1] === 'undefined'){
            $('#nextButton').val('View Result');
        }else if($('#nextButton').val() === "View Result" && typeof questions[currQuestion+1] !== 'undefined'){
            $('#nextButton').val('Next');
        }
        
    }

    //Function for displaying score
    function displayScore(){
        //Calculate score
        let score = getScore(questions, answers);
        //Hide navigation
        $('#nextButton').hide();
        $('#backButton').hide();
        //Print score
        $('#questionBox h2:first').text("Your score is:");
        $('#questionBox h2').after('<p>' + score + '</p>');
        $('#questionBox').find('h2, #questionList', 'li', '.button').fadeIn();
    }

    //Function for calculating score
    function getScore(questions, answers){
        let score = 0;
        questions.forEach(function(element, index) {
            //Check if answer is correct
            if(element.correctAnswer == answers[index]){
                score++;
            }
        });
        return score;

    }

    function verifyQuestion(){
        console.log("Inside verify");
        if($('#questionList input:checked').length > 0){
            return true;
        }
        else{
            return false;
            
        }
    }

    function displayError(error){
        let errorDiv = $('<div class="errorBox">'+error+'</div>').hide();
        $(errorDiv).insertBefore("#questionBox h2").slideToggle("fast");
        window.setTimeout(function(){
            $(errorDiv).slideToggle("fast", function(){
                $(this).remove();
            });
            
        }, 1500);
    }

    //Display the first question
    if(document.cookie){
        welcomeUser();
    }
    displayQuestion(questions[currQuestion]);
    

    //Event handler for clicking the 'next' button
    $('#nextButton').on('click', function(){
        if(!verifyQuestion()){
            displayError("Please select a question!");
            return;
        }
        $('#questionBox').find('h2, #questionList', 'li', '.button').hide();
        //Update answer
        answers[currQuestion] = $('input[name=question'+currQuestion+']:checked').val();
        //Empty questionList
        
        $('#questionList').empty();
        
        //Check if there are more questions and if there already is an answer stored for the question
        if(questions[currQuestion+1] && typeof answers[currQuestion] !== 'undefined'){
            currQuestion++;
            
            displayQuestion(questions[currQuestion], answers[currQuestion]);
            
        }
        else if(questions[currQuestion+1]){
            currQuestion++;

            displayQuestion(questions[currQuestion]);
            
        }
        else{
            //Display score if no more questions 
            displayScore();
        }
        
    });

    //Event handler for clicking the 'back' button
    $('#backButton').on('click', function(){
        //$('#questionBox').hide();
        $('#questionBox').find('h2, #questionList', 'li', '.button').hide();  
        $('#questionList').empty();
        if(questions[currQuestion-1]){
            currQuestion--;
            displayQuestion(questions[currQuestion], answers[currQuestion]);
        }
    });

    $(window).resize(function(){
        let height = $('#header').outerHeight()-2;
        let pos = $('#loginButton').offset().left - $('#loginButton').width()*2;
        $('#loginBox').css({
            top: height + "px",
            left: pos + "px"
        });
    })

    $('#loginButton').on('click', function(){
        let height = $('#header').outerHeight()-2;
        let pos = $('#loginButton').offset().left - $('#loginButton').width()*2;
        $('#loginBox').css({
            top: height + "px",
            left: pos + "px"
        });
        $('#loginBox').slideToggle('fast');
    });

    $('#registerButton').on('click', function(){
        let username = $('#loginForm').find('#username').val();
        console.log(username);
        let password = $('#loginForm').find('#password').val();
        console.log(password);
        localStorage.setItem("username", JSON.stringify(username));
        localStorage.setItem("password", JSON.stringify(password));
    });

    $('#loginForm').on('submit', function(e){
        e.preventDefault();
        console.log("Submitted form");
        let username = $('#loginForm').find('#username').val();
        let password = $('#loginForm').find('#password').val();
        let storedUser = JSON.parse(localStorage.getItem("username"));
        let storedPwd = JSON.parse(localStorage.getItem("password"));
        if(username === storedUser && password === storedPwd){
            console.log("Successful login as: " + username)
            document.cookie = "username=JSHC";
            userCookie = document.cookie;
            console.log(userCookie);
            welcomeUser();
        }
        else{
            console.log("Couldn't login as: " + username)
        }
    });

    function welcomeUser(){
        let username = document.cookie;
        username = username.substring(username.indexOf("=")+1);
        console.log(username);
        if($('#loginButton').is(":visible")){
            $('#loginButton').hide();
        }
        $('#usernameBox').css({display: "inline-block"});
        $('#usernameBox').text("Welcome " + username);
    }

    //Hide loginbox if open and user clicks outside, WIP

    $('body').on('click', function(e){
        //Check if user clicked the login div
        if(!$('#loginBox').is(e.target)){
            //If they didn't, check if user clicked the login button or any element inside the login box
            if(!$("#loginBox").has(e.target).length > 0 && !$("#loginButton").is(e.target)){
                //If they didn't, they clicked outside, slide the loginbox up
                $("#loginBox").slideUp();
            }
        }
        
    });

    


});
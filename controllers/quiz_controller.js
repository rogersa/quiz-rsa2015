var models = require('../models/models.js');

exports.load = function(req,res,next,quizId){
  models.Quiz.find(quizId).then(
  function(quiz){
   if(quiz){
       req.quiz = quiz;
       next();
   }else{ next(new Error("No existe quizId="+ quizId));}
  
  }
  
  ).catch(function (error){next(error);});

};

exports.show = function(req,res){
models.Quiz.find(req.params.quizId).then(function(quiz){
 res.render('quizes/show',{quiz : req.quiz,errors:[]});	
})

};
exports.answer = function(req,res){
 models.Quiz.find(req.params.quizId).then(function (quiz){
     
     var resultado = "Incorrecto";
      if(req.query.respuesta === req.quiz.respuesta)
	  {
		  resultado = "Correcto";
	  }
        res.render('quizes/answer',{quiz:req.quiz,respuesta:resultado,errors:[]});
	  
     
 })		    
};

exports.index = function(req,res){

    models.Quiz.findAll().then(function(quizes){ 
    res.render('quizes/index.ejs',{quizes:quizes,errors:[]});
    }).catch(function(error){next(error)});

};

exports.new = function(req,res){
 var quiz =models.Quiz.build({pregunta:"Pregunta",respuesta: "Respuesta"});
    res.render('quizes/new',{quiz:quiz,errors:[]});
}

exports.create = function(req,res){
 var quiz = models.Quiz.build(req.body.quiz);
 console.log("Valor create: "+quiz);
 quiz
 .validate()
 .then(
       function (err){
         if(err)
         { res.render("quizes/new",{quiz:quiz,errors:err.errors});}
         else 
         {
           quiz
           .save({fields:["pregunta","respuesta"]})
           .then(function(){res.redirect("/quizes");})
         }
       }
 );
};

exports.search = function(req,res){
  
  if(req.query.search)
  {
   
    models.Quiz.findAll({where:["pregunta LIKE ?","%"+req.query.search.toLowerCase().replace("%"," ")+"%"]}).then(function(result){ 
    res.render('quizes/busqueda',{result:result});})
  }

};



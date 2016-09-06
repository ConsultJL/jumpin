# JumpIn Node Web Application

## Getting started
1. Clone this repository.
2. Ensure you are running Node V4.2.4 or higher
3. Modify [/config/config.js](/config/config.js#L12) with YOUR database credentials
4. Execute ```npm install```
5. You will need to make a modification to a node_module, it's a known bug that has not be fixed yet.
   1. Open node_modules/sequelize-cli/lib/task/db.js
   2. Change line 340 from 
   ```node
   return new Sequelize(config.database, config.username, config.password, options);
   ```
   To 
   ```node
   return new Sequelize(config.db);
   ```
6. Execute ```node_modules/.bin/sequelize db:migrate``` from your project directory. This will execute all migrations in the migration directory.
7. Execute ```node app.js```
8. Navigate to [http://localhost:3000](http://localhost:3000)
9. Winning, start your development.

## General Layout
Everything you will care about is located in /app/.
* All of your controllers should be placed [here](/app/controllers)
* All of your views should be placed [here](/app/views)
* If they are a protected view they should be placed [here](/app/views/protected)
* All of your models should be placed [here](/app/models)

## Packages used
* [Handlebars](http://handlebarsjs.com/) is used for all display logic.
* [Passport](http://passportjs.org/docs) is used for authentication and session tracking.
* [Sequelize](http://docs.sequelizejs.com/en/v3/) is used for all database interactions.
* [Sequelize Migrations](http://docs.sequelizejs.com/en/latest/docs/migrations/) for all migrations.
* ThemeKit 4.0 was used as the theme of the site.
* [Multer](https://www.npmjs.com/package/multer), [Multer-s3](https://www.npmjs.com/package/multer-s3) & [AWS-SDK](https://www.npmjs.com/package/aws-sdk) are used for all Amazon interactions mostly around S3.
* For all other minor packages please refer to the [package.json](/package.json)

## Deployment and Production Hosting
* This site is currently hosted in [Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/)
* Elastic Beanstalk uses the config located in [.ebextensions](/.ebextensions/01_files.config) you can add additional configurations to this directory, just keep in mind their naming convention.
* **ALL DATABASE CHANGES MUST BE MANUALLY APPLIED AS THEY ARE SENSITIVE AND SHOULD ONLY BE DONE BY A SINGLE ADMIN OR ANOTHER PERSON YOU CAN TRUST WITH PRODUCTION DATABASE ACCESS**

### Deploying a new copy WITHOUT automatic GitHub deployments.
1. Log into your [AWS account](https://console.aws.amazon.com)
2. Then click Services at the top and locate Elastic Beanstalk.
3. Click the green "Default-Environment" box
4. Note the version number located above "Upload and Deploy"
5. Return to your terminal and type ```./build [VERSION NUMBER+1]```
6. Return to your web browser
7. Cick "Upload and Deploy" located in the center of your screen.
8. Upload the ZIP file created and assign the proper version name.
9. You will notice that your instance will restart and the new site will be built and deployed.

### Rolling back a deployment to a previous version.
1. Log into your [AWS account](https://console.aws.amazon.com)
2. Then click Services at the top and locate Elastic Beanstalk.
3. Click the green "Default-Environment" box
4. Click the button located in the center of the screen "Upload and Deploy"
5. Click "Application Versions page" located in the blue box on the current screen.
6. From here you can select which version you would like to deploy by checking the box located to the left of the version.
7. Then click "Deploy" in the top right corner. 

### Integrating Continuous Deployments
I would recommend you purchase a paid account located at [https://www.deployhq.com](https://www.deployhq.com) OR using [https://aws.amazon.com/codedeploy/](https://aws.amazon.com/codedeploy/). I would personally use AWS CodeDeploy OVER DeployHQ because it's all integrated together in AWS. If you need assistance in setting up continuous deployments please reach out to me (Jeremy Lancaster) and I will assist you with this transition. 


## Example addition
I wanted to add a quick example of how to add a new page to the website. Here we will be adding schools and many teams can belong to a single school.

### Step 1: Creating a new model
You will want to add the following code to a new file located in [/app/models](/app/models) named school.js
```node
module.exports = function (sequelize, DataTypes) {

  var School = sequelize.define('School', {
    name: DataTypes.STRING
  }, {
      classMethods: {
        associate: function (models) {
          School.hasMany(models.Team);
        }
      }
    });
  
    return School;
  };
  ```
  Here we've created a new model to store the name and ID of the school, we've also let the model know that many TEAMS belong to a single SCHOOL.

### Step 2: Create a new view
Now this is completely up to you but at a minimum your view should contain the following HTML.
```html
<body>
{{> navbar }}
<!-- content push wrapper -->
<div class="st-pusher" id="content" style="margin-top: 50px;">

    <!-- sidebar effects INSIDE of st-pusher: -->
    <!-- st-effect-3, st-effect-6, st-effect-7, st-effect-8, st-effect-14 -->

    <!-- this is the wrapper for the content -->
    <div class="st-content">

        <!-- YOUR CONTENT WOULD GO HERE -->

    </div>
    <!-- /st-content -->

</div>
<!-- /st-pusher -->

<!-- Footer -->
<footer class="footer">
    <strong>JumpIn</strong>&copy; Copyright 2016
</footer>
<!-- // Footer -->

</div>
<!-- /st-container -->

<!-- Inline Script for colors and config objects; used by various external scripts; -->
<script>
    var colors = {
        "danger-color": "#e74c3c",
        "success-color": "#81b53e",
        "warning-color": "#f0ad4e",
        "inverse-color": "#2c3e50",
        "info-color": "#2d7cb5",
        "default-color": "#6e7882",
        "default-light-color": "#cfd9db",
        "purple-color": "#9D8AC7",
        "mustard-color": "#d4d171",
        "lightred-color": "#e15258",
        "body-bg": "#f6f6f6"
    };
    var config = {
        theme: "learning",
        skins: {
            "default": {
                "primary-color": "#16ae9f"
            },
            "orange": {
                "primary-color": "#e74c3c"
            },
            "blue": {
                "primary-color": "#4687ce"
            },
            "purple": {
                "primary-color": "#af86b9"
            },
            "brown": {
                "primary-color": "#c3a961"
            }
        }
    };
</script>
```

### Step 3: Create a new controller for school.
You will want to add the following code to a new file located in [/app/controllers](/app/controllers) named school.js
```node
var express = require('express'),
  router = express.Router(),
  db = require('../models'),
  passport = require('passport');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/my_school', function (req, res, next) {
  if(req.user) {
    var displayName = req.user.username;
    var isTeammate = req.user.TeamId;
  }

  db.School.findAll({
    where: {
      SchoolID: req.user.schoolID
    }
  }).then(function(school) {
    res.render('my_school', {
      title: 'Jump Institute',
      isLoggedIn: req.isAuthenticated(),
      username: displayName,
      isPartOfTeam: isTeammate,
      school: school
    });
  })
});
```
Here we've created a new controller to display our school information. This will just pass the school variable to the view.

### Step 4. Final Comments
Please keep in mind that this isn't production level code and it was not tested however it gives you a general idea of how to get involved in the code base. Please feel free to reach out to me at jeremy@consultjl.com should you have any questions.

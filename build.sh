echo $1
zip -r JumpIn\ V$1.zip .bowerrc .ebextensions/ .editorconfig .gitignore Gruntfile.js app app.js bower.json config/ package.json public/
echo "Build completed for V$1. Please upload to AWS Elastic Beanstalk to deploy!"

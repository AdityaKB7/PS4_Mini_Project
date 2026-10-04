pipeline {
    agent any
    
    tools {
        nodejs 'node18'
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Clean Workspace & Docker') {
            steps {
                // Ignore errors if the container doesn't exist yet
                catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS') {
                    bat 'docker stop ml_container'
                    bat 'docker rm ml_container'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t placement-app-prod .'
            }
        }

        stage('Deploy Container') {
            steps {
                bat 'docker run -d -p 8000:8000 --name ml_container placement-app-prod'
                // Give the container 5 seconds to fully start the FastAPI server
                sleep time: 5, unit: 'SECONDS'
            }
        }

        stage('Automated Selenium Testing') {
            steps {
                dir('tests') {
                    bat 'npm install'
                    bat 'node test.js'
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully. The application is running on port 8000!'
        }
        failure {
            echo 'Pipeline failed! Shutting down the broken container.'
            bat 'docker stop ml_container'
            bat 'docker rm ml_container'
        }
    }
}
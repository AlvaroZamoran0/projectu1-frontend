pipeline {
    agent any
    tools{
        nodejs 'NODEJS_21_7_3'
    }
    stages{

        stage('Checkout'){
            steps{
                checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/AlvaroZamoran0/projectu1-frontend.git']])
            }
        }

        stage('Install dependencies'){
            steps{
                bat 'npm install'
            }
        }

        stage('Build frontend'){
            steps{
                bat 'npm run build'
            }
        }

        stage('Build docker image'){
            steps{
                script{
                    bat 'docker build -t 4lvaroz/projectu1-frontend . --no-cache'
                }
            }
        }
        stage('Push image to Docker Hub'){
            steps{
                script{
                   withCredentials([string(credentialsId: 'dhpswid', variable: 'dhpsw')]) {
                        bat 'docker login -u 4lvaroz -p %dhpsw%'
                   }
                   bat 'docker push 4lvaroz/projectu1-frontend:latest'
                }
            }
        }
    }
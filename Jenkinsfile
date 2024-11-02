pipeline {
    agent any
    stages{
        stage('create build'){
            steps{
                checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/AlvaroZamoran0/projectu1-frontend']])
                bat 'npm run build'
            }
        }

        stage('Build docker image'){
            steps{
                script{
                    bat 'docker build -t 4lvaroz/projectu1-frontend:latest .'
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
}
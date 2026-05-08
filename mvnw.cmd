@echo off
setlocal

set "ROOT=%~dp0"
set "MAVEN=%ROOT%.tools\apache-maven-3.9.15\bin\mvn.cmd"
set "LOCAL_REPO=%ROOT%.m2\repository"

if exist "%MAVEN%" (
  call "%MAVEN%" "-Dmaven.repo.local=%LOCAL_REPO%" %*
) else (
  call mvn %*
)

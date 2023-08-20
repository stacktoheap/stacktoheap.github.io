---
layout: post
title: "Why I love Jetbrains TeamCity as a .NET developer"
date: 2012-11-18 21:50
comments: true
categories: [teamcity, .net, ci, cd, nuget]
excerpt: "TeamCity is great for any tech stack. It's .NET related features make it stand out in the .NEt world"
---

TeamCity is a delightful CI server in its own right. The amazing [features](http://www.jetbrains.com/teamcity/features/index.html) make it a very good offering in the CI / CD space.

What makes it even better is the amazing support for .NET. I find other tools severely lacking when it comes to .NET. As a .NET developer and DevOps person, I just love TeamCity. The attention and thought given by the developers in providing .NET related features is just amazing. There have been times when I was trying to see if TeamCity can do something and there would soon be a smile on my face when I realize that yes, it can. While TeamCity offers a plethora of features for the .NET develper / project, here I highlight my most favorite. These definitely make TeamCity indispensible as a CI server for a .NET project.

**Nuget Feed Server** - This is something I was not really expecting. When we thought about using in-house Nuget packages in our projects, we started exploring options for hosting a Nuget feed. Setting up a Nuget server is not a big deal. You can even point towards a filesystem folder. We can write scripts that will copy the packages from the build and put it in a path where a feed application can pick it up and expose it. That is when I came across the fact that Teamcity itself can act as a feed server ( and the aforementioned smile was to be found on my face again.) All you have to do is, just artifact a `.nupkg` file like you would normally do in a Build configuration and voilà ! The package is available in the feed!

**TeamCity Powershell Runner** - Next comes the Powershell runner. While you can easily run any custom command from TeamCity, and hence can run powershell script and commands, having a runner for it makes for quick and easy setup.

![TeamcityPowershell]({{ site.url }}/images/teamcity-powershell.png)

Again, the runner is not a simple task that would just call Powershell and lets you specify a file that you want to run. You can specify if you want to use the 32-bit or 64-bit console. You can can specify a path to a file or specify the powershell source itself directly ( when you do the latter, you can also reference teamcity properties and those will be directly substituted in the source.) You can specify if the script is to be executed with Powershell by passing the `-File` option or by using the `-Command` option and pass in the script through stdin. Effectively, the runner covers all scenarios that you may want to use Powershell with. The setup is easy, clear and powerful.

![TeamCityRunners]({{ site.url }}/images/teamcity-runners.PNG)

**Other .NET specific runners** - Teamcity has the whole set of .NET tools covered in form of runners. I can see myself using Nuget Package and Installer tasks for quickly setting up packaging and also installing nuget packages in the builds of my OSS projects. I am kind of against having such tasks handled by the CI server as that would tie you to the specific CI server and the way you build on local dev box would be different from what you do on the CI server. It is better to have them in your buildscripts. But for my pet projects, I can quickly boostrap the CI by using these runners.

There are many other features - small and big - that make the life of a .NET developer that much more easier.

TeamCity is really a wonderful tool. I hope it builds upon its wonderful .NET support.

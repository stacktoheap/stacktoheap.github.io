---
layout: post
title: "Writing a Git provider for Windows Powershell - Part 1"
date: 2012-12-01 22:03
comments: true
categories: [git, powershell, provider, pit]
excerpt: "In this first part, we will look at setting up the infrastructure required to write a PowerShell provider for Git - creating a snap-in, registering the provider etc."
---

I have been wanting to write a Powershell provider that will help me manage git repositories on my machine. Kind of like what "Github for Windows" does, but for the console. For a start, I want a `git:\` drive which will list all the projects I am tracking in my machine and can quickly help me navigate to them and perform appropriate actions on them. I am still thinking about how else I can put this to use

In this post, I talk about how to start writing a Powershell snap-in required to register and add the provider.

First, start a standard C# class library. I suppose there are templates for creating Powershell snap-ins, cmdlets, providers etc. But the ones I came across were for 2005 and 2008. Anyway, I wanted to start afresh and see how it goes.

We need a reference to `System.Management.Automation`. The easiest way I have come across so far is to simply add the line `<Reference Include="System.Management.Automation" />` in the appropriate section in your csproj file:

{% highlight xml %}
<ItemGroup>
	<Reference Include="System" />
	<Reference Include="System.Core" />
	<Reference Include="System.Xml.Linq" />
	<Reference Include="System.Data.DataSetExtensions" />
	<Reference Include="Microsoft.CSharp" />
	<Reference Include="System.Data" />
	<Reference Include="System.Xml" />
	<Reference Include="System.Management.Automation" />
</ItemGroup>
{% endhighlight %}

Next off, we start with the snap-in. When you want to register all the cmdlets and providers that can be registered from the assembly, it is as simple as adding a public class that extends the abstract `PSSnapIn`. A sample snapin class would like below, with necessary meta-data related members implemented:

{% highlight csharp %}
[RunInstaller(true)]
public class Pit : PSSnapIn
{
    public override string Name
    {
        get { return "Pit"; }
    }

    public override string Vendor
    {
        get { return "StackToHeap"; }
    }

    public override string Description
    {
        get { return "Git provider for Powershell"; }
    }
}
{% endhighlight %}

The `RunInstaller` attribute is required to register the snap-in using InstallUtil.

![powershellsnapin]({{ site.url }}/images/pssnapin.png)

After building the project, we can register the snap-in in Powershell. For registering, as mentioned above, we make use of InstallUtil. For 64-bit and .Net Framework 4, you want to run the InstallUtil.exe located at `%systemroot%\Microsoft.NET\Framework64\v4.0.30319\installutil.exe`. Just pass in the path to the built assembly and the snap-in will be registered in Powershell ( might need an elevated prompt.) You may also add a post-build event to your project with: `%systemroot%\Microsoft.NET\Framework64\v4.0.30319\installutil.exe $(TargetPath)`

After registering, you can see if it was successfull by running `Get-PSSnapin -Registered`

Registering doesn't activate the snapin, however. You have to "add" the snap-in, with, ofcourse, the `Add-PSSnapin`  cmdlet.

Note, you can uninstall a snapin registered with InstallUtil by running the same command as before but with the `/u` flag.

---
layout: post
title: "Writing a Git provider for Windows Powershell - Part 2"
date: 2012-12-03 20:37
comments: true
categories: [powershell, git, provider, pit]
excerpt: "In this part we look at creating the provider and mounting the default drive at git:\\"
---

In [Part 1](http://stacktoheap.com/blog/2012/12/01/writing-a-git-provider-for-windows-powershell-part-1/), I described how to start writing a provider with the corresponding snap-in required to load the provider. In this post, I describe the more exciting part - writing the actual provider code.

To recap, I am trying to write a git provider for Powershell that I can use to manage git repositories on my machine. The provider will create a `git:\` drive that will hold my tracked repositories. I can create new repositories or start following existing repositories. I can switch to one of the repositories being tracked. Categorize repositories. And many more ( read - I haven't fully thought about it yet.)

Let's start by writing a `GitProvider`. A provider can derive from one of the abstract provider types based on what the provider is doing. As a bare minimum, a provider will extend from `DriveCmdletProvider`. Depending on what the provider does, a provider may extend from `ItemCmdletProvider` or `ContainerCmdletProvider` or `NavigationCmdletProvider` ( in order of least to most derived.)

As I want the git provider to provide for containers ( categories ) and items ( the git repos themselves ), I am going to have my provider derive from `ContainerCmdletProvider`. The bare bones class will look like below:

{% highlight csharp %}
[CmdletProvider("Git", ProviderCapabilities.None)]
class GitProvider : ContainerCmdletProvider
{
    protected override bool IsValidPath(string path)
    {
        throw new NotImplementedException();
    }
}
{% endhighlight %}

The `CmdletProvider` attribute helps in loading the provider when the snap-in is added and specifies the name of the provider and its capabilities.

Next, we override the `InitializeDefaultDrives` method to setup the default drives that are to be loaded when the provider is loaded.

{% highlight csharp %}
protected override Collection<PSDriveInfo> InitializeDefaultDrives()
{
    return new Collection<PSDriveInfo>
               {
                   new GitDriveInfo("git", ProviderInfo, "git:", "Git Provider", null, true)
               };
}
{% endhighlight %}

In this case, I setup a `git:` drive. `GitDriveInfo` is a simple wrapper over `PSDriveInfo` to hold state.

![psdrives]({{ site.url }}/images/psdrives.png)

If you build and add the registered snap-in, you should be able to see the `git:` drive on doing `Get-PSDrive`

I plan to track the repositories in a `.gitdrive` file at `$HOME`. It will be a simple CSV file that holds the name of the project / repo and the filesystem path to it:

{% highlight bash %}
Name, Path
pit,c:\project\oss\pit
{% endhighlight %}

 To do that, we need to create the base config file when the provider is loaded, if it doesn't exist already. We can do that in the `Start` method like so:
{% highlight csharp %}
 protected override ProviderInfo Start(ProviderInfo providerInfo)
{
    gitConfigManager.TryCreateConfigFile();
    return ProviderInfo;
}
{% endhighlight %}

`gitConfigManager` just creates a base csv if it doesn't already exists.

We can't switch into our `git:` drive just yet, as we haven't provided much information about it. We now override the `ItemExists`method:

{% highlight csharp %}
protected override bool ItemExists(string path)
{
    return string.IsNullOrEmpty(path);
}
{% endhighlight %}

Currently, the logic is simple. If the path is null or empty, it is the root of the dirve, and we return true for it. As we proceed, we will see if the path is a valid tracked repo path in `ItemExists` as well.

We will now be able to `cd git:\`. The provider has started taking shape!

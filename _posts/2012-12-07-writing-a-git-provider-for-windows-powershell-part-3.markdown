---
layout: post
title: "Writing a Git provider for Windows Powershell - Part 3"
date: 2012-12-07 23:59
comments: true
categories: [git, powershell, provider, pit]
excerpt: "In this final part, we look at implementing some basic Git commands like status, add, commit etc using the provider interface."
---

In [Part 2](http://stacktoheap.com/blog/2012/12/03/writing-a-git-provider-for-windows-powershell-part-2/), we saw how to create the provider with a default drive at `git:\` and stopped after being able to `cd` into the drive. The provider doesn't really do much, but it is now time to change that.

Once we have the drive, we want to start adding new items to it. Items here are new repos to be tracked. We want to start tracking existing repositories or create and track new repositories. The `New-Item` cmdlet is the standard cmdlet to create new items ( normally, it would be a new file or directory.) We will add the ability to support `New-Item` to our provider such that it will allow us to implement the scenario described above.

I basically want to start tracking a repo ( let's keep it simple for now and think about tracking existing repos):

{% highlight powershell %}
New-Item git:\Pit -RepoPath C:\Projects\oss\Pit
{% endhighlight %}

I want to start tracking the git repo at filesystem location `C:\Projects\oss\Pit` at my proivder location `git:\Pit`. Of course, `-RepoPath` is not a valid parameter to `New-Item`. But thankfully, we can add dynamic parameters to provider cmdlets like `New-Item` which help in making the providers all the more meaningful and powerful.

We achieve the `New-Item` cmdlet support and adding the dynamic parameters by overriding the `NewItem()` and `NewItemDynamicParameters()` methods.

Let us start off with adding the dynamic parameter `RepoPath`:

{% highlight csharp %}

protected override object NewItemDynamicParameters(string path, string itemTypeName, object newItemValue)
{
    return new NewItemParameters();
}

public class NewItemParameters
{
    [Parameter(Mandatory = true)]
    public string RepoPath { get; set; }
}

{% endhighlight %}

![NewItemDynamicParameters]({{ site.url }}/images/pitnewitem.PNG)

In the `NewItemDynamicParameters` we simple return an instance of `NewItemParameters`. As shown above, `NewItemParameters` defines the parameters as properties - in this case just one - that are marked by the `Parameter` attribute. Additional details like whether the parameter is mandatory or not can be provided with the attribute. In this case `RepoPath` is a mandatory string parameter to New-Item. We can now build and verify that `New-Item` does require a `RepoPath` parameter when trying to create an item under `git:\`. Even tab completion works as expected.

Lets implement the `NewItems` method that will do the bulk of the work. You can access the dynamic parameters passed to the cmdlet by using the `DynamicParameters` property and casting it to the expected object ( `NewItemParameters` ).

{% highlight csharp %}
protected override void NewItem(string path, string itemTypeName, object newItemValue)
{
    var newItemParameters = DynamicParameters as NewItemParameters;

    gitConfigManager.TrackRepo(path, newItemParameters.RepoPath);
}
{% endhighlight %}

It is pretty simple. We obtain the `RepoPath` from dynamic parameters and pass it to the manager which writes to the config file. Note that the helper ensures that we add it only if it is not being already tracked. In case a repo by the same name is already tracked, and the repo path is different, the path is updated.

It is also simple to add another dynamic parameter like `-New` if we want to create a new repository and track it. Note that the `-New` parameter will be a switch parameter and will be defined as below:

{% highlight csharp %}
public class NewItemParameters
    {
        [Parameter(Mandatory = true)]
        public string RepoPath { get; set; }

        [Parameter]
        public SwitchParameter New { get; set; }
    }
{% endhighlight %}

Also `SwitchParameter` has a implicit conversion to bool so you can freely use it as a bool to see if you have to create a new repository or not.

Now we are able to create and track repositories from the provider!

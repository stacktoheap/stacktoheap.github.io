---
layout: post
title: "Better code analysis with Resharper 7 contract annotations"
date: 2012-12-02 17:57
comments: true
categories: [resharper, c#, visual studio, resharper 7, contract annotations]
excerpt: "Resharper 7 introduces support for Code Contracts annotations in .NET code. This allows for more robust static analysis and validation of code contracts."
---

With Resharper 7, JetBrains has built upon the existing annotations attributes like `CanBeNull` to introduce contract annotations in the form of `ContractAnnotationAttribute`

In this post I am going to talk about a particular use case for these - writing validation (extension) methods.

Let's take the hypothetical case of writing extensions of objects to see if it is null or not. A straightforward extension for doing so would like:

{% highlight csharp %}
public static class ObjectExtensions
{
    public static bool IsNull(this object me)
    {
        return me == null;
    }

    public static bool IsNotNull(this object me)
    {
        return me != null;
    }
}
{% endhighlight %}

Now, if you put the methods to use in a method like below ( pardon the contrived example):

{% highlight csharp %}
public void TestMethod()
{
    var test = SomeCondition() ? new Test() : null;
    if (test.IsNotNull() && test.Call())
    {

    }
}

private bool SomeCondition()
{
    return true;
}
{% endhighlight %}

For the `test.Call()`, Resharper would give a warning `Possible 'NullReferenceException'`. As far as Resharper knows, `test` can be `null` if `SomeCondition()` returns false and hence raises the warning for you ( note that for performance and reasons beyond the scope of this post, Resharper doesn't analyze that `SomeCondtion()`, in this case, only returns true.)

And, as far as Resharper is concerned, `test.IsNotNull()` can be true or false irrespective of `test` being null or not.

This is where contracts annotations can help Resharper analyze the situation better. You can add the contracts saying `IsNotNull` will return false when the input is null.

![resharper_contracts_annotations]({{ site.url }}/images/resharper_contract_annotations.png)

To add code contracts, you can go to menu `Resharper -> Options -> Code Annotations -> Copy Default Implementation to Clipboard`. Paste the copied code to some file like `ResharperAnalysisHelpers.cs` and place it in an appropriate location.

Next, add the `ContractsAnnotationAttribute` to the extension methods stating the necessasry contract:

{% highlight csharp %}
public static class ObjectExtensions
{
    [ContractAnnotation("null => true")]
    public static bool IsNull(this object me)
    {
        return me == null;
    }

    [ContractAnnotation("null => false")]
    public static bool IsNotNull(this object me)
    {
        return me != null;
    }
}
{% endhighlight %}

It is pretty straightforward. For the `IsNull` method, we specify that if the input is null, the method returns true. For `IsNotNull`, it's the other way around.

Once this is done, we will see that Resharper doesn't warn about the possible null reference anymore. It got the "hint" that `IsNotNull` will return true only when the input was not null ( too bad it didn't know that from the name of the method ;))

 Contracts annotations allow you to specify parameter names, out variable values, that the method can throw exception etc. For more details, see this [blog post](http://blogs.jetbrains.com/dotnet/2012/08/contract-annotations-in-resharper-7/)

 There is of course the question of whether you want to add attributes to your code just to support a specific tool to work better. But, Resharper is a tool that I think is a must for .NET development and most people I know use it and swear by it. Using Resharper specific code will not seem odd. Moreover, the ContractsAnnotations are much better than the gross "suppress comments" I see in some codebases.

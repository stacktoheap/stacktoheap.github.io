---
layout: post
title: "Using TypeConverters to get AppSettings in .NET"
date: 2013-01-20 03:01
comments: true
categories: [c#, .net, AppSetting, TypeConverters]
excerpt: "A quick way to get strongly typed AppSettings in .NET using TypeConverters."
---

The most easiest way to get AppSettings in .NET is to use the `ConfigurationManager`. It goes like:

{% highlight csharp %}
var debugSetting = ConfigurationManager.AppSettings["IsDebug"];
{% endhighlight %}

The `AppSettings` property is just a `NameValueCollection` - an association of string keys and string values. You pass in the string key whose value you want and you get the string value back.

So, if your `App.config` were like:

{% highlight xml %}
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
  <appSettings>
    <add key="IsDebug" value="true" />
  </appSettings>
</configuration>
{% endhighlight %}

The `debugSetting` will have the string value "true". But most often, you don't want just the string. Even in this example, you want a boolean value to see if debug is enabled or not (contrived, yes). So, you end up doing something like:

{% highlight csharp %}
var debugSetting = Convert.ToBoolean(ConfigurationManager.AppSettings["IsDebug"]);
if(debugSetting){
    //do something nasty
}
{% endhighlight %}

Same goes for integers, urls, and so many other types. Get back the string, convert it to the type that is needed, and consume it.

Is there a better way to all this, which is also pretty simple? `TypeConverters` to the rescue!

We can define an `AppSettings` helper like this:

{% highlight csharp %}
public static class AppSettings
{
    public static T Get<T>(string key)
    {
        var appSetting = ConfigurationManager.AppSettings[key];
        if (string.IsNullOrWhiteSpace(appSetting)) throw new AppSettingNotFoundException(key);
        
        var converter = TypeDescriptor.GetConverter(typeof(T));
        return (T)(converter.ConvertFromInvariantString(appSetting));
    }
}

//usage
var debugSetting = AppSettings.Get<bool>("Debug");
{% endhighlight %}

Here we use `TypeDescriptor.GetConverter()` method to get a `TypeConverter` for the type `T` we want to convert to. Then we get the converted value from the converter by calling its `ConvertFromInvariantString`, the input to which is of course the value from the appSetting.

This helper can now be used for various types which have converters. Consider a sample `App.config`:

{% highlight xml %}
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
  <appSettings>
    <add key="IsDebug" value="true" />
    <add key="MyEnumValue" value="1" />
    <add key="MyEnumValue2" value="A" />
    <add key="ServiceEndpoint" value="http://www.example.com" />
    <add key="MyFavColor" value="Red" />
  </appSettings>
</configuration>
{% endhighlight %}

With that config, you can easily get the values you need, in the type that you will use them in:

{% highlight csharp %}
var isDebug = AppSettings.Get<bool>("IsDebug");
var myEnumValue = AppSettings.Get<TestEnum>("MyEnumValue");
var myEnumValue2 = AppSettings.Get<TestEnum>("MyEnumValue2");
var myFavColor = AppSettings.Get<Color>("MyFavColor");
var serviceEndpoint = AppSettings.Get<Uri>("ServiceEndpoint");
{% endhighlight %}

The above example works for `bool`, `TestEnum`, `Color` and `Uri` types. Easy!
---
layout: post
title: "Contract testing a JSON service in .NET"
date: 2012-10-31 20:57
comments: true
categories: [.net, contract tests, json]
excerpt: "In this post I discuss how to write contract tests for a JSON service."
---

Recently, we started using a JSON service in our MVC 3 website. The API was complicated and was prone to changes. We needed a way to ensure that our application would not be broken without anyone noticing when the API changes. It is pretty clear that we wanted Consumer Driven Contracts tests against the service to ensure that the contract ( which would be a subset of the API) that we expect as a consumer of the service is not broken.

We set about writing the contract tests by using JSON schema validation. The actual validation itself was made pretty simple with the help of JSON.NET. The tests were written against the service for each functionality. A functionality depended on different subsets of the API and a failing test would clearly indicate which functionality was broken.

A typical contract test, which are Nunit tests, looked like this:

{% highlight csharp %}
[Test]
public void ShouldBeAbleToValidateTheJSONServiceResponseForFunctionalityA()
{
    const string schemaJson = @"
{
    'description': 'Service Response',
    'type': 'object',
    'properties': {
        'product': {
            'type': 'object',
            'properties': {
                'availability': {
                        'type': 'array',
                        'items': {
                                    'type': 'object',
                                    'properties': {
                                                    'Local': { 'type' : 'number'},
                                                    'Storehouse': { 'type' : 'number'},
                                                }
                                }
                    }
            }        
        }
    }
}";
    var parameters = new Dictionary<string, object> { { "id", 1 }, { "city", "Chennai" } };
    AssertResponseIsValidSchema(schemaJson, parameters);
}
{% endhighlight %}

The `AssertResponseIsValidSchema()` is pretty standard. It uses RestSharp to get the API response and validates the schema with a Nunit assert:

{% highlight csharp %}
private void AssertResponseIsValidSchema(string schemaJson, Dictionary<string, object> parameters)
{
    var schema = JsonSchema.Parse(schemaJson);
    var restRequest = new RestRequest(Method.GET);
    parameters.ForEach(pair => restRequest.AddParameter(pair.Key, pair.Value));
    var restResponse = restClient.Execute(restRequest);
    var availablity = JObject.Parse(restResponse.Content);

    Assert.That(availablity.IsValid(schema), Is.True);
}
{% endhighlight %}

The JSON schema is written as per the [proposed draft](http://json-schema.org/) and JSON.NET's `IsValid()` is used to perfom the validation itself.

The contract tests are also not run along with the normal build pipeline, but in a separate flow. Since we are hitting a service, we don't want our main builds to be affected if the service is down or to slow down the builds. The separately run tests are the right balance in making sure the contract is not broken, while making sure the external factors don't affect the builds.

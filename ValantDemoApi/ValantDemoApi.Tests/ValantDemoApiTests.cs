using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Newtonsoft.Json;
using NUnit.Framework;

namespace ValantDemoApi.Tests
{
  [TestFixture]
  public class ValantDemoApiTests
  {
    private HttpClient client;

    [OneTimeSetUp]
    public void Setup()
    {
      var factory = new APIWebApplicationFactory();
      this.client = factory.CreateClient();
    }

    [Test]
    public async Task ShouldReturnAllFourDirectionsForMovementThroughMaze()
    {
      var result = await this.client.GetAsync("/Maze?northWall=false&southWall=false&eastWall=false&westWall=false&row=1&col=1&gameRow=5&gameCol=5");
      result.EnsureSuccessStatusCode();
      var content = JsonConvert.DeserializeObject<string[]>(await result.Content.ReadAsStringAsync());
      content.Should().Contain("Up");
      content.Should().Contain("Down");
      content.Should().Contain("Left");
      content.Should().Contain("Right");
    }

    [Test]
    public async Task ShouldReturnOnlyUpDirectionsForMovementThroughMaze()
    {
      var result = await this.client.GetAsync("/Maze?northWall=false&southWall=true&eastWall=true&westWall=true&row=1&col=1&gameRow=5&gameCol=5");
      result.EnsureSuccessStatusCode();
      var content = JsonConvert.DeserializeObject<string[]>(await result.Content.ReadAsStringAsync());
      content.Should().Contain("Up");
      content.Should().NotContain("Down");
      content.Should().NotContain("Left");
      content.Should().NotContain("Right");
    }


    [Test]
    public async Task ShouldReturnOnlyDownDirectionsForMovementThroughMaze()
    {
      var result = await this.client.GetAsync("/Maze?northWall=true&southWall=false&eastWall=true&westWall=true&row=1&col=1&gameRow=5&gameCol=5");
      result.EnsureSuccessStatusCode();
      var content = JsonConvert.DeserializeObject<string[]>(await result.Content.ReadAsStringAsync());
      content.Should().NotContain("Up");
      content.Should().Contain("Down");
      content.Should().NotContain("Left");
      content.Should().NotContain("Right");
    }

    [Test]
    public async Task ShouldReturnOnlyRightDirectionsForMovementThroughMaze()
    {
      var result = await this.client.GetAsync("/Maze?northWall=true&southWall=true&eastWall=false&westWall=true&row=1&col=1&gameRow=5&gameCol=5");
      result.EnsureSuccessStatusCode();
      var content = JsonConvert.DeserializeObject<string[]>(await result.Content.ReadAsStringAsync());
      content.Should().NotContain("Up");
      content.Should().NotContain("Down");
      content.Should().NotContain("Left");
      content.Should().Contain("Right");
    }

    [Test]
    public async Task ShouldReturnOnlyLeftDirectionsForMovementThroughMaze()
    {
      var result = await this.client.GetAsync("/Maze?northWall=true&southWall=true&eastWall=true&westWall=false&row=1&col=1&gameRow=5&gameCol=5");
      result.EnsureSuccessStatusCode();
      var content = JsonConvert.DeserializeObject<string[]>(await result.Content.ReadAsStringAsync());
      content.Should().NotContain("Up");
      content.Should().NotContain("Down");
      content.Should().Contain("Left");
      content.Should().NotContain("Right");
    }

    [Test]
    public async Task ShouldNotReturnUptDirectionsForMovementThroughMaze()
    {
      var result = await this.client.GetAsync("/Maze?northWall=false&southWall=true&eastWall=true&westWall=false&row=0&col=1&gameRow=5&gameCol=5");
      result.EnsureSuccessStatusCode();
      var content = JsonConvert.DeserializeObject<string[]>(await result.Content.ReadAsStringAsync());
      content.Should().NotContain("Up");
    }

    [Test]
    public async Task ShouldNotReturnDowntDirectionsForMovementThroughMaze()
    {
      var result = await this.client.GetAsync("/Maze?northWall=true&southWall=false&eastWall=true&westWall=false&row=5&col=1&gameRow=5&gameCol=5");
      result.EnsureSuccessStatusCode();
      var content = JsonConvert.DeserializeObject<string[]>(await result.Content.ReadAsStringAsync());
      content.Should().NotContain("Down");
    }

    [Test]
    public async Task ShouldNotReturnLefttDirectionsForMovementThroughMaze()
    {
      var result = await this.client.GetAsync("/Maze?northWall=false&southWall=true&eastWall=true&westWall=false&row=0&col=0&gameRow=5&gameCol=5");
      result.EnsureSuccessStatusCode();
      var content = JsonConvert.DeserializeObject<string[]>(await result.Content.ReadAsStringAsync());
      content.Should().NotContain("Left");
    }

    [Test]
    public async Task ShouldNotReturnRightDirectionsForMovementThroughMaze()
    {
      var result = await this.client.GetAsync("/Maze?northWall=true&southWall=false&eastWall=true&westWall=false&row=5&col=5&gameRow=5&gameCol=5");
      result.EnsureSuccessStatusCode();
      var content = JsonConvert.DeserializeObject<string[]>(await result.Content.ReadAsStringAsync());
      content.Should().NotContain("Right");
    }

  }
}

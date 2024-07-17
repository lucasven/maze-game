using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace ValantDemoApi.Controllers
{
  [ApiController]
  [Route("[controller]")]
  public class MazeController : ControllerBase
  {
    private readonly ILogger<MazeController> _logger;

    public MazeController(ILogger<MazeController> logger)
    {
      _logger = logger;
    }

    [HttpGet]
    public IEnumerable<string> GetNextAvailableMoves(bool northWall, bool southWall, bool eastWall, bool westWall, int row, int col, int gameRow, int gameCol)
    {
      var availableMoves = new List<string>();
      if (!northWall && row != 0)
      {
        availableMoves.Add("Up");
      }
      if (!southWall && row != gameRow)
      {
        availableMoves.Add("Down");
      }
      if (!eastWall && col != gameCol)
      {
        availableMoves.Add("Right");
      }
      if (!westWall && col != 0)
      {
        availableMoves.Add("Left");
      }

      return availableMoves;
    }
  }
}

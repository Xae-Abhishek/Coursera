using Microsoft.AspNetCore.Mvc;
using UserManagementAPI.Models;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserRepository _repository;

    public UsersController(IUserRepository repository)
    {
        _repository = repository;
    }

    // GET: api/users
    [HttpGet]
    public IActionResult GetAllUsers() => Ok(_repository.GetAll());

    // GET: api/users/5
    [HttpGet("{id}")]
    public IActionResult GetUserById(int id)
    {
        var user = _repository.GetById(id);
        return user == null ? NotFound() : Ok(user);
    }

    // POST: api/users
    [HttpPost]
    public IActionResult CreateUser([FromBody] User user)
    {
        _repository.Add(user);
        return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, user);
    }

    // PUT: api/users/5
    [HttpPut("{id}")]
    public IActionResult UpdateUser(int id, [FromBody] User updatedUser)
    {
        var existing = _repository.GetById(id);
        if (existing == null) return NotFound();

        updatedUser.Id = id;
        _repository.Update(updatedUser);
        return NoContent();
    }

    // DELETE: api/users/5
    [HttpDelete("{id}")]
    public IActionResult DeleteUser(int id)
    {
        var user = _repository.GetById(id);
        if (user == null) return NotFound();

        _repository.Delete(id);
        return NoContent();
    }
}

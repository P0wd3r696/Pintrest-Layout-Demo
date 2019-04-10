using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Demo.Models;
using Demo.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using System.IO;

namespace Demo.Controllers
{
    public class HomeController : Controller
    {
        private readonly DataContext _db;

        private readonly IHostingEnvironment _hostingEnvironment;

        public HomeController(DataContext db, IHostingEnvironment hostingEnvironment)
        {
            _db = db;
            _hostingEnvironment = hostingEnvironment;
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            return View(await _db.Images.ToListAsync());
        }

        [HttpGet]
        public async Task<IActionResult> Create()
        {
            MyImages images = new MyImages();
            return View(images);
        }

        [HttpPost,ActionName("Create")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Created(MyImages images)
        {
            if(ModelState.IsValid)
            {
                _db.Add(images);
                await _db.SaveChangesAsync();

                //Update image in db
                string webRootPath = _hostingEnvironment.WebRootPath;
                var files = HttpContext.Request.Form.Files;
                var imageItemFromDb = _db.Images.Find(images.Id);

                if(files[0] != null && files[0].Length > 0)
                {
                    var uploads = Path.Combine(webRootPath, "images");
                    var extension = files[0].FileName.Substring(files[0].FileName.LastIndexOf("."),
                                    files[0].FileName.Length - files[0].FileName.LastIndexOf("."));

                    using (var filestream = new FileStream(Path.Combine(uploads, images.Id + extension), FileMode.Create))
                    {
                        files[0].CopyTo(filestream);
                    }
                    imageItemFromDb.Images = @"\images\" + images.Id + extension;

                    await _db.SaveChangesAsync();
                }
                return RedirectToAction(nameof(Create));
            }
            return View(images);
        }

        public async Task<JsonResult> GetCategory(string Category)
        {
            int imageCount = Convert.ToInt32(Category);

            if(imageCount == 0)
            {
                var allImages = await _db.Images.ToListAsync();

                return Json(allImages);
            }
            else
            {
                var imageCounter = _db.Images.Take(imageCount).ToList();

                return Json(imageCounter);
            }
            
        }
    }
}

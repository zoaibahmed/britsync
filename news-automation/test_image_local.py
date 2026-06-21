import os
from app.services.image_pipeline import ImagePipeline

pipeline = ImagePipeline()
print(f"Project Root: {pipeline.project_root}")
print(f"Image Dir: {pipeline.image_dir}")

# Test process_news
test_title = "Test Image Generation 2026 04 29"
test_category = "AI"
result_path = pipeline.process_news(test_title, test_category)

print(f"Result Path in DB: {result_path}")
abs_path = os.path.join(pipeline.image_dir, "2026", "04", "test-image-generation-2026-04-29.webp")
print(f"Expected Abs Path: {abs_path}")
print(f"Exists: {os.path.exists(abs_path)}")

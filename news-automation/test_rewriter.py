
import sys
import os

# Add the project root to sys.path
_script_dir = os.path.dirname(os.path.abspath(__file__))
_root_dir = os.path.abspath(os.path.join(_script_dir, ".."))
if _root_dir not in sys.path:
    sys.path.insert(0, _root_dir)

from app.services.content_rewriter import ContentRewriter

def test():
    rewriter = ContentRewriter()
    print(f"Available models: {rewriter.available_models}")
    
    title = "Apple’s Next Big Thing Is a Push Into Visual Artificial Intelligence"
    snippet = "Apple is working on a new push into visual AI, according to sources familiar with the matter at Bloomberg."
    
    print("\n--- TEST REWRITE ---")
    result = rewriter.rewrite_summary(title, snippet)
    if result:
        print(f"Length: {len(result)} chars")
        print(f"Result: {result}")
    else:
        print("FAILED to rewrite")

if __name__ == "__main__":
    test()

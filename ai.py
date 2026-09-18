from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import ollama

class AIRequestHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """ Handles network handshakes (CORS) so your friend's frontend doesn't get blocked """
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        """ Catches the chat logs from your friend's frontend, cleans them, and sends back JSON """
        if self.path == '/api/process-feeds':
            # 1. Read the network data string sent by the frontend app
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            messages = data.get('messages', [])
            
            print(f"\n📥 Ingested {len(messages)} active chat logs from teammate's frontend...")
            formatted_input_stream = "\n".join([f"- {msg}" for msg in messages])
            
            # 2. Define the strict processing instructions for local Llama 3.1
            system_prompt = (
                "You are an advanced, autonomous notification sorting engine built for university freshers. "
                "Analyze the list of messages provided. Your task is to perform three operations:\n"
                "1. Identify common topics (e.g., if multiple messages mention the same exam shift, merge them into ONE entry).\n"
                "2. Completely remove and ignore casual chatter, greetings, waffle talk, or low-priority banter.\n"
                "3. Categorize the unique events, identify explicit deadlines, and determine urgency.\n\n"
                "Return a strict JSON array containing objects ONLY. Do not use markdown wraps or conversational filler. "
                "Every object inside the array must conform exactly to this structure:\n"
                "{\n"
                "  \"urgency\": \"CRITICAL\" or \"MODERATE\" or \"LOW\",\n"
                "  \"headline\": \"Ultra short title of the unified issue\",\n"
                "  \"action_item\": \"Concrete task the student must complete, or None\",\n"
                "  \"deadline\": \"Extracted date/time, or None\"\n"
                "}"
            )
            
            # 3. Call your local offline AI model brain
            try:
                response = ollama.generate(
                    model='llama3.1',
                    prompt=f"{system_prompt}\n\nIncoming Stream:\n{formatted_input_stream}",
                    options={"temperature": 0.0}
                )
                result_data = json.loads(response['response'].strip())
            except Exception as e:
                print(f"❌ Ollama connection warning: {e}")
                result_data = [{"urgency": "LOW", "headline": "Engine Synchronization Delay", "action_item": "None", "deadline": "None"}]
                
            # 4. Shoot the clean, structured data matrix back to the frontend website
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(result_data).encode('utf-8'))

def run_server():
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, AIRequestHandler)
    print('🚀 Built-in AI Core Server actively running on http://localhost:8000 ...')
    print('👉 Keep this black window open. Your teammate\'s frontend can now connect completely!')
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()

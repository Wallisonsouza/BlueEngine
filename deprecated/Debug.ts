// export default class Debug {

//     private static lastMessage: string | null = null;  // Armazenar a última mensagem
//     private static messageCount: number = 0;  // Contador para a repetição de mensagens

//     public static get element(): HTMLElement | null {
//         return document.getElementById("console-output");
//     }

//     public static log(...messages: any[]): void {
//         let formattedMessage = messages.map(msg => Debug.formatMessage(msg)).join(" ");
      
//         // Se a mensagem for a mesma da última, incrementa o contador
//         if  (formattedMessage === Debug.lastMessage) {
//             Debug.messageCount++;
    
//             // Atualiza o contador na última linha de log
//             const lastLogEntry = this.element?.lastElementChild as HTMLElement;
//             const countSpan = lastLogEntry?.querySelector(".message-count");
    
//             if (countSpan) {
//                 countSpan.textContent = `x(${Debug.messageCount})`;  
//             }
//             return;  // Não cria uma nova entrada de log
//         }
    
//         // Se a mensagem for diferente, cria uma nova entrada de log e reinicia o contador
//         Debug.lastMessage = formattedMessage;
//         Debug.messageCount = 1;
    
//         const logEntry = document.createElement("div");
//         logEntry.className = "message-line";
    
//         // Adiciona as mensagens como spans
//         messages.forEach((msg) => {

        
//             const textElement = document.createElement("span");
//             textElement.className = "message-text";
//             const { text, color } = Debug.parseColorMessage(msg);
        
//             textElement.textContent = text;
//             if (color) textElement.style.color = color;
        
//             logEntry.appendChild(textElement);
            
//         });
        
    
//         const countSpan = document.createElement("span");
//         countSpan.classList.add("message-count");
//         countSpan.textContent = `x(${Debug.messageCount})`;
//         logEntry.appendChild(countSpan);
//         // Adiciona o log entry ao elemento
//         this.element?.appendChild(logEntry);
    
//         // Adiciona rolagem automática para o final
//         this.element?.scrollTo({ top: this.element.scrollHeight, behavior: "smooth" });
//     }
    
    
    

//     private static formatMessage(message: any): string {
//         if (typeof message === "object") {
//             try {
//                 return JSON.stringify(message, null, 2);
//             } catch {
//                 return `[Unserializable Object: ${message.constructor?.name || 'Unknown'}]`;
//             }
//         }
//         return String(message);
//     }

//     private static parseColorMessage(msg: string): { text: string; color?: string } {
//         const colorMatch = msg.match(/^@color\((#(?:[0-9A-Fa-f]{6})|rgb(a?)\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*([\d.]+))?\))\)/);
    
//         if (colorMatch) {
//             let color = colorMatch[1]; // Cor hexadecimal, se existir
    
//             if (!color) {
//                 // Se for RGB(A), constrói a string correta
//                 const [_, alpha, r, g, b, a] = colorMatch;
//                 color = alpha ? `rgba(${r}, ${g}, ${b}, ${a ?? 1})` : `rgb(${r}, ${g}, ${b})`;
//             }
    
//             // Remover o prefixo @color(...) com segurança
//             const cleanedMessage = msg.substring(colorMatch[0].length).trim();
    
//             return { text: cleanedMessage, color };
//         }
    
//         return { text: msg }; // Retorna mensagem sem cor, se não houver
//     }

//     public static clearLogs(): void {
//         this.element!.innerHTML = "";
//         console.log("[DEBUG] Logs limpos.");
//     }
// }

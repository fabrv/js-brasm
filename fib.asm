.model small 
.stack 200 
.data 
 ri db ?  
.code 
 mov ax, @data 
 mov ds, ax 
 call main 
 
 f proc 
 push bp 
 mov bp, sp
 mov ax, word ptr [bx - 2]
 mov cx, word ptr [bp + 2]
 mov ax, cx 
 mov word ptr [bx - 2], ax
 mov ax, word ptr [bp + 2]
 mov cx, 2
 cmp ax, cx
 jge .0123
 mov cx, word ptr [bx - 2]
 jmp .0123
 .0123:
 mov ax, word ptr [bx - 2]
 mov cx, 1
 sub ax, cx
 mov cx, ax
 mov ax, word ptr [bx - 4]
 mov cx, cx
 mov ax, cx 
 mov word ptr [bx - 4], ax
 push word ptr [bx - 4]
 push 0
 call f
 mov ax, cx
 mov cx, 0
 add ax, cx
 mov cx, ax
 mov ax, word ptr [bx - 4]
 mov cx, cx
 mov ax, cx 
 mov word ptr [bx - 4], ax
 mov ax, word ptr [bx - 2]
 mov cx, 2
 sub ax, cx
 mov cx, ax
 mov ax, word ptr [bx - 6]
 mov cx, cx
 mov ax, cx 
 mov word ptr [bx - 6], ax
 push word ptr [bx - 6]
 push 0
 call f
 mov ax, cx
 mov cx, 0
 add ax, cx
 mov cx, ax
 mov ax, word ptr [bx - 6]
 mov cx, cx
 mov ax, cx 
 mov word ptr [bx - 6], ax
 mov ax, word ptr [bx - 4]
 mov cx, word ptr [bx - 6]
 add ax, cx
 mov cx, ax
 mov ax, word ptr [bx - 4]
 mov cx, cx
 mov ax, cx 
 mov word ptr [bx - 4], ax
 mov cx, word ptr [bx - 4]
 jmp .012
 .012:
 pop bp 
 ret 4 
 f endp
 main proc 
 push bp 
 mov bp, sp
 mov bx, 3000
 push 2
 push 0
 call f
 mov ax, cx
 mov cx, 0
 add ax, cx
 mov cx, ax
 mov ax, word ptr [bx - 8]
 mov cx, cx
 mov ax, cx 
 mov word ptr [bx - 8], ax
 mov ri, '0' 
 mov al, byte ptr word ptr [bx - 8] 
 add ri, al 
 mov dl, ri 
 mov ah, 2 
 int 21h
 .045:
 mov ah,4CH 
 int 21H
 pop bp 
 ret  
 main endp
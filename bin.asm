.model small 
 .stack 200 
 .data  
 .code 
 mov ax, @data 
 mov ds, ax 
 
 main proc 
 push bp 
 mov bp, sp
 mov bx, 3000
 mov ax, word ptr [bx - 2]
 mov cx, 2
 mov ax, cx 
 mov word ptr [bx - 2], ax
 mov ax, word ptr [bx - 4]
 mov cx, 3
 mov ax, cx 
 mov word ptr [bx - 4], ax
 mov ax, word ptr [bx - 2]
 mov cx, word ptr [bx - 4]
 add ax, cx
 mov word ptr [bx - 2], ax
 mov ax, word ptr [bx - 2]
 mov cx, 
 add ax, cx
 mov word ptr [bx - 2], ax
 mov ax, word ptr [bx - 2]
 mov cx, word ptr [bx - 2]
 mul cx
 mov word ptr [bx - 2], ax
 mov ax, word ptr [bx - 6]
 mov cx, word ptr [bx - 2]
 mov ax, cx 
 mov word ptr [bx - 6], ax
 .012:
 mov ah,4CH 
 int 21H
 pop bp 
 ret  
 main endp
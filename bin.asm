.model small 
.stack 200 
.data  
.code 
 mov ax, @data 
 mov ds, ax 
 call main 
 
 f proc 
 push bp 
 mov bp, sp
 mov ax, word ptr [bp + 4]
 mov cx, word ptr [bp + 6]
 add ax, cx
 mov cx, ax
 mov ax, cx
 jmp .012
 .012:
 pop bp 
 ret 4 
 f endp
 main proc 
 push bp 
 mov bp, sp
 mov bx, 3000
 mov ax, word ptr [bx - 2]
 mov cx, 1
 mov ax, cx 
 mov word ptr [bx - 2], ax
 mov ax, word ptr [bx - 4]
 mov cx, 2
 mov ax, cx 
 mov word ptr [bx - 4], ax
 mov ax, word ptr [bx - 2]
 mov cx, word ptr [bx - 4]
 add ax, cx
 mov cx, ax
 mov ax, cx
 mov cx, word ptr [bx - 2]
 add ax, cx
 mov cx, ax
 mov ax, word ptr [bx - 2]
 mov cx, cx
 mov ax, cx 
 mov word ptr [bx - 2], ax
 .034:
 mov ah,4CH 
 int 21H
 pop bp 
 ret  
 main endp
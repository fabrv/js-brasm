.model small 
.stack 200 
.data 
 ri db ? 
 string0 db 'Resut: ', '$' 
.code 
 mov ax, @data 
 mov ds, ax 
 call main 
 
 f proc 
 push bp 
 mov bp, sp
 mov ax, word ptr [bx - 4]
 mov cx, 1
 mov ax, cx 
 mov word ptr [bx - 4], ax
 mov ax, word ptr [bx - 2]
 mov cx, 0
 mov ax, cx 
 mov word ptr [bx - 2], ax
 .0123ret:
 mov ax, word ptr [bx - 2]
 mov cx, word ptr [bp + 6]
 cmp ax, cx
 jge .0123
 mov ax, word ptr [bx - 4]
 mov cx, word ptr [bp + 4]
 mul cx
 mov cx, ax
 mov ax, word ptr [bx - 4]
 mov cx, cx
 mov ax, cx 
 mov word ptr [bx - 4], ax
 mov ax, word ptr [bx - 2]
 mov cx, 1
 add ax, cx
 mov cx, ax
 mov ax, word ptr [bx - 2]
 mov cx, cx
 mov ax, cx 
 mov word ptr [bx - 2], ax
 jmp .0123ret
 .0123:
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
 push 2
 call f
 mov ax, cx
 mov cx, 0
 add ax, cx
 mov cx, ax
 mov ax, word ptr [bx - 6]
 mov cx, cx
 mov ax, cx 
 mov word ptr [bx - 6], ax
 lea dx, string0 
 mov ah, 9 
 int 21h
 mov ri, '0' 
 mov al, byte ptr word ptr [bx - 6] 
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
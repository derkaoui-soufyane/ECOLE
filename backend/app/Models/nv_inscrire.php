<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class nv_inscrire extends Model
{
    protected $table = 'nv_inscrire'; 
    protected $fillable = ['nom_i','prenom_i','num_tele',"nom_parents","telephone_parent",'email','password',"id_filiere"];
    protected $hidden = ["password"];
    public function filieres(){
        return $this->belongsTo(filieres::class, 'id_filiere');
    }
}
